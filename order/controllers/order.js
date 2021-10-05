/* eslint-disable eqeqeq */
const { default: axios } = require('axios');
const { validationResult } = require('express-validator');
const { Sequelize } = require('sequelize');
const { Order, OrderItem, CartItem } = require('../model');
const errors = require('../util/errors');

const getRestaurants = async (auth) => {
  const res = await axios.get(`${global.gConfig.restaurant_url}/restaurants/all`, {
    headers: { Authorization: auth },
  });

  const map = {};
  res.data.forEach((ele) => {
    map[ele.id] = ele;
  });

  return map;
};

const getAddresses = async () => {
  const res = await axios.get(`${global.gConfig.customer_url}/customers/addresses/all`, {
    headers: { Authorization: 'admin' },
  });

  const map = {};
  res.data.forEach((ele) => {
    map[ele.id] = ele;
  });

  return map;
};

const getAllOrders = async (req, res) => {
  const { user, role } = req.headers;

  const { status } = req.query;

  let whereQ = { customerId: user };
  if (role == 'restaurant') {
    whereQ = { restaurantId: user };
  }

  if (status && status != '') {
    whereQ.status = status;
  }

  const orders = await Order.findAll({
    where: whereQ,
    include: [OrderItem],
    order: [['id', 'DESC']],
  });

  try {
    // get all restaurants
    const restaurantMap = await getRestaurants(req.headers.authorization);
    const addressMap = await getAddresses();

    // map each order with restaurant and dishes
    const result = orders.map((order) => {
      const dishMap = {};
      restaurantMap[order.restaurantId].dishes.forEach((ele) => {
        dishMap[ele.id] = ele;
      });

      const dishes = order.orderitems.map((oi) => ({
        ...oi.dataValues,
        dish: dishMap[oi.dishId],
      }));

      return {
        ...order.dataValues,
        restaurant: restaurantMap[order.restaurantId],
        orderitems: dishes,
        address: order.addressId ? addressMap[order.addressId] : null,
      };
    });

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    if (err.isAxiosError) {
      if (err.response.status == 404) {
        res.status(404).json({ ...errors.notFound, message: err.message });
      } else {
        res.status(500).json({ ...errors.serverError, message: err.message });
      }
    } else if (err.original) {
      res.status(500).json({ status: 500, message: err.original.sqlMessage });
    } else {
      res.status(500).json(errors.serverError);
    }
  }
};

// TODO: access order details based in role
const getOrderById = async (req, res) => {
  const { id } = req.params;
  const { user } = req.headers;

  const order = await Order.findOne({
    where: { customerId: user, id },
    include: [OrderItem],
  });
  if (!order) {
    res.status(404).json(errors.notFound);
    return;
  }

  try {
    const resResp = await axios(
      `${global.gConfig.restaurant_url}/restaurants/${order.restaurantId}`,
      { headers: { Authorization: req.headers.authorization } },
    );
    if (resResp.status != 200) {
      res.status(500).json(errors.serverError);
      return;
    }

    const dishMap = {};
    resResp.data.dishes.forEach((dish) => {
      dishMap[dish.id] = dish;
    });

    const orderItems = order.orderitems.map((item) => ({
      ...item.dataValues,
      dish: dishMap[item.dishId],
    }));

    const result = {
      ...order.dataValues,
      restaurant: resResp.data,
      orderitems: orderItems,
    };

    if (order.addressId) {
      const addResp = await axios(
        `${global.gConfig.customer_url}/customers/addresses/${order.addressId}`,
        { headers: { Authorization: req.headers.authorization } },
      );
      if (resResp.status != 200) {
        res.status(500).json(errors.serverError);
        return;
      }
      result.address = addResp.data;
    }

    res.status(200).json(result);
    return;
  } catch (err) {
    console.error(err);
    if (err.isAxiosError) {
      if (err.response.status == 404) {
        res.status(404).json({ ...errors.notFound, message: err.message });
      } else {
        res.status(500).json({ ...errors.serverError, message: err.message });
      }
    } else if (err.original) {
      res.status(500).json({ status: 500, message: err.original.sqlMessage });
    } else {
      res.status(500).json(errors.serverError);
    }
  }
};

const createOrder = async (req, res) => {
  const { user } = req.headers;
  const { type } = req.params;
  if (!(type === 'delivery' || type === 'pickup')) {
    res.status(400).json(errors.badRequest);
    return;
  }

  const cartItems = await CartItem.findAll({ where: { customerId: user } });
  if (!cartItems || cartItems.length === 0) {
    res.status(404).json({ ...errors.notFound, message: 'you have no items in cart' });
    return;
  }

  // get restaurant details(
  const t = await global.DB.transaction();
  try {
    const response = await axios.get(
      `${global.gConfig.restaurant_url}/restaurants/${cartItems[0].restaurantId}`,
      { headers: { Authorization: req.headers.authorization } },
    );

    if (response.status != 200) {
      res.status(500).json(errors.serverError);
      return;
    }

    const dishMap = {};
    response.data.dishes.forEach((dish) => {
      dishMap[parseInt(dish.id, 10)] = dish;
    });

    let orderAmount = 0;
    cartItems.forEach((item) => {
      orderAmount += dishMap[item.dishId].price * item.quantity;
    });

    const nOrder = await Order.create(
      {
        amount: orderAmount,
        status: 'INIT',
        date: Sequelize.fn('NOW'),
        restaurantId: cartItems[0].restaurantId,
        customerId: user,
        type,
      },
      { transaction: t },
    );

    const orderItems = cartItems.map((item) => ({
      dishId: item.dishId,
      restaurantId: item.restaurantId,
      quantity: item.quantity,
      orderId: nOrder.id,
      notes: item.notes,
    }));

    await OrderItem.bulkCreate(orderItems, { transaction: t });

    await CartItem.destroy({ where: { customerId: user } }, { transaction: t });

    await t.commit();

    const resultOrder = await Order.findOne(
      { where: { id: nOrder.id }, include: [OrderItem] },
      { transaction: t },
    );

    const orderDishes = resultOrder.orderitems.map((item) => ({
      ...item.dataValues,
      dish: dishMap[item.dishId],
    }));

    res
      .status(201)
      .json({ ...resultOrder.dataValues, orderitems: orderDishes, restaurant: response.data });
    return;
  } catch (err) {
    await t.rollback();
    console.error(err);
    if (err.isAxiosError) {
      if (err.response.status == 404) {
        res.status(404).json({ ...errors.notFound, message: err.message });
      } else {
        res.status(500).json({ ...errors.serverError, message: err.message });
      }
    } else if (err.original) {
      res.status(500).json({ status: 500, message: err.original.sqlMessage });
    } else {
      res.status(500).json(errors.serverError);
    }
  }
};

const placeOrder = async (req, res) => {
  const { user } = req.headers;

  const valErr = validationResult(req);
  if (!valErr.isEmpty()) {
    console.error(valErr);
    res.status(400).json({ status: 400, message: valErr.array() });
    return;
  }

  const { orderId, addressId } = req.body;

  const order = await Order.findOne({ where: { id: orderId, customerId: user, status: 'INIT' } });
  if (!order) {
    res.status(404).json(errors.notFound);
    return;
  }
  try {
    // check if address with given id exists for customer
    const response = await axios.get(
      `${global.gConfig.customer_url}/customers/addresses/${addressId}`,
      { headers: { Authorization: req.headers.authorization } },
    );

    if (response.status != 200) {
      res.status(404).json({ ...errors.notFound, message: 'address not found' });
      return;
    }

    // if exists then update order with status PLACED and addressId
    order.addressId = response.data.id;
    order.status = 'PLACED';

    await order.save();

    const nOrder = await Order.findOne({ where: { id: order.id }, include: [OrderItem] });

    const resResp = await axios.get(
      `${global.gConfig.restaurant_url}/restaurants/${nOrder.restaurantId}`,
      { headers: { Authorization: req.headers.authorization } },
    );

    if (resResp.status != 200) {
      res.status(500).json(errors.serverError);
      return;
    }

    const dishMap = {};
    resResp.data.dishes.forEach((dish) => {
      dishMap[parseInt(dish.id, 10)] = dish;
    });

    const orderDishes = nOrder.orderitems.map((item) => ({
      ...item.dataValues,
      dish: dishMap[item.dishId],
    }));

    res.status(200).json({
      ...nOrder.dataValues,
      address: response.data,
      orderitems: orderDishes,
      restaurant: resResp.data,
    });
    return;
  } catch (err) {
    console.error(err);
    if (err.isAxiosError) {
      if (err.response.status == 404) {
        res.status(404).json({ ...errors.notFound, message: err.message });
      } else {
        res.status(500).json({ ...errors.serverError, message: err.message });
      }
    } else if (err.original) {
      res.status(500).json({ status: 500, message: err.original.sqlMessage });
    } else {
      res.status(500).json(errors.serverError);
    }
  }
};

const updateOrderStatus = async (req, res) => {
  const { user } = req.headers;
  const { id } = req.params;

  const valErr = validationResult(req);
  if (!valErr.isEmpty()) {
    console.error(valErr);
    res.status(400).json({ status: 400, message: valErr.array() });
    return;
  }

  const { status } = req.body;

  const order = await Order.findOne({ where: { id, restaurantId: user } });
  if (!order) {
    res.status(404).json(errors.notFound);
    return;
  }

  order.status = status;

  await order.save();

  try {
    const nOrder = await Order.findOne({ where: { id: order.id }, include: [OrderItem] });

    const resResp = await axios.get(
      `${global.gConfig.restaurant_url}/restaurants/${nOrder.restaurantId}`,
      { headers: { Authorization: req.headers.authorization } },
    );

    if (resResp.status != 200) {
      res.status(500).json(errors.serverError);
      return;
    }

    const dishMap = {};
    resResp.data.dishes.forEach((dish) => {
      dishMap[parseInt(dish.id, 10)] = dish;
    });

    const orderDishes = nOrder.orderitems.map((item) => ({
      ...item.dataValues,
      dish: dishMap[item.dishId],
    }));

    const result = {
      ...nOrder.dataValues,
      orderitems: orderDishes,
      restaurant: resResp.data,
    };

    const addressMap = getAddresses();

    if (order.addressId) {
      result.address = addressMap[order.addressId];
    }

    res.status(200).json(result);
    return;
  } catch (err) {
    console.error(err);
    if (err.isAxiosError) {
      if (err.status == 404) {
        res.status(404).json({ ...errors.notFound, message: err.message });
      } else {
        res.status(500).json({ ...errors.serverError, message: err.message });
      }
    } else if (err.original) {
      res.status(500).json({ status: 500, message: err.original.sqlMessage });
    } else {
      res.status(500).json(errors.serverError);
    }
  }
};

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  placeOrder,
  updateOrderStatus,
};
