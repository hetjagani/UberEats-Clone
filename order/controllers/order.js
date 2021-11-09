/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
/* eslint-disable eqeqeq */
const { default: axios } = require('axios');
const { validationResult } = require('express-validator');
const { Types } = require('mongoose');
const { getPaiganation } = require('u-server-utils');
const { Order, CartItem } = require('../model');
const errors = require('../util/errors');
const { makeRequest } = require('../util/kafka/client');

const getRestaurants = async (auth) => {
  const res = await axios.get(`${global.gConfig.restaurant_url}/restaurants/all`, {
    headers: { Authorization: auth },
  });

  const map = {};
  res.data.forEach((ele) => {
    map[ele._id] = ele;
  });

  return map;
};

const getAddresses = async () => {
  const res = await axios.get(`${global.gConfig.customer_url}/customers/addresses/all`, {
    headers: { Authorization: 'admin' },
  });

  const map = {};
  res.data.forEach((ele) => {
    map[ele._id] = ele;
  });

  return map;
};

const getAllOrders = async (req, res) => {
  const { user, role } = req.headers;

  const { status } = req.query;

  let whereQ = { customerId: Types.ObjectId(user) };
  if (role == 'restaurant') {
    whereQ = { restaurantId: Types.ObjectId(user) };
  }

  if (status && status != '') {
    whereQ.status = status;
  }

  const { limit, offset } = getPaiganation(req.query.page, req.query.limit);

  const ordersCnt = await Order.count(whereQ);
  const orders = await Order.find(whereQ).sort({ date: -1 }).skip(offset).limit(limit);

  try {
    // get all restaurants
    const restaurantMap = await getRestaurants(req.headers.authorization);
    const addressMap = await getAddresses();

    // map each order with restaurant and dishes
    const result = orders.map((order) => {
      const dishMap = {};
      restaurantMap[order.restaurantId].dishes.forEach((ele) => {
        dishMap[ele._id] = ele;
      });

      const dishes = order.orderitems.map((oi) => {
        if (dishMap[oi.dishId]) {
          return {
            ...oi._doc,
            dish: dishMap[oi.dishId],
          };
        }
      });

      return {
        ...order._doc,
        restaurant: restaurantMap[order.restaurantId],
        orderitems: dishes,
        address: order.addressId ? addressMap[order.addressId] : null,
      };
    });

    res.status(200).json({ nodes: result, total: ordersCnt });
  } catch (err) {
    console.error(err);
    res.status(500).json(errors.serverError);
  }
};

const getAllRestaurantsOrder = async (req, res) => {
  const { user } = req.headers;

  const orders = await Order.find({ restaurantId: Types.ObjectId(user) });

  try {
    // get all restaurants
    const restaurantMap = await getRestaurants(req.headers.authorization);
    const addressMap = await getAddresses();

    // map each order with restaurant and dishes
    const result = orders.map((order) => {
      const dishMap = {};
      restaurantMap[order.restaurantId].dishes.forEach((ele) => {
        dishMap[ele._id] = ele;
      });

      const dishes = order.orderitems.map((oi) => {
        if (dishMap[oi.dishId]) {
          return {
            ...oi._doc,
            dish: dishMap[oi.dishId],
          };
        }
      });

      return {
        ...order._doc,
        restaurant: restaurantMap[order.restaurantId],
        orderitems: dishes,
        address: order.addressId ? addressMap[order.addressId] : null,
      };
    });

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json(errors.serverError);
  }
};

const getOrderById = async (req, res) => {
  const { id } = req.params;
  const { user } = req.headers;

  const order = await Order.findOne({ customerId: user, _id: id });
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
      dishMap[dish._id] = dish;
    });

    const orderItems = order.orderitems.map((item) => ({
      ...item._doc,
      dish: dishMap[item.dishId],
    }));

    const result = {
      ...order._doc,
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

  const cartItems = await CartItem.find({ customerId: Types.ObjectId(user) });
  if (!cartItems || cartItems.length === 0) {
    res.status(404).json({ ...errors.notFound, message: 'you have no items in cart' });
    return;
  }

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
      dishMap[dish._id] = dish;
    });

    let orderAmount = 0;
    cartItems.forEach((item) => {
      orderAmount += dishMap[item.dishId].price * item.quantity;
    });

    const orderItems = cartItems.map((item) => ({
      dishId: item.dishId,
      restaurantId: item.restaurantId,
      quantity: item.quantity,
      notes: item.notes,
      price: dishMap[item.dishId].price,
    }));

    makeRequest(
      'order.create',
      {
        amount: orderAmount,
        status: 'INIT',
        date: Date.now(),
        restaurantId: cartItems[0].restaurantId,
        customerId: Types.ObjectId(user),
        type,
        orderitems: orderItems,
      },
      async (err, resp) => {
        if (err || !resp) {
          res.status(500).json(errors.serverError);
          return;
        }

        await CartItem.deleteMany({ customerId: Types.ObjectId(user) });

        const resultOrder = await Order.findOne({ _id: Types.ObjectId(resp._id) });

        const orderDishes = resultOrder.orderitems.map((item) => ({
          ...item._doc,
          dish: dishMap[item.dishId],
        }));

        res
          .status(201)
          .json({ ...resultOrder._doc, orderitems: orderDishes, restaurant: response.data });
      },
    );
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

const placeOrder = async (req, res) => {
  const { user } = req.headers;

  const valErr = validationResult(req);
  if (!valErr.isEmpty()) {
    console.error(valErr);
    res.status(400).json({ status: 400, message: valErr.array() });
    return;
  }

  const { orderId, addressId, notes } = req.body;

  const order = await Order.findOne({
    _id: Types.ObjectId(orderId),
    customerId: Types.ObjectId(user),
    status: 'INIT',
  });
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

    order.addressId = response.data._id;
    order.status = 'PLACED';
    order.notes = notes;

    makeRequest('order.place', { id: order._id, order }, async (err, resp) => {
      if (err || !resp) {
        res.status(500).json(errors.serverError);
        return;
      }

      const nOrder = await Order.findOne({ _id: Types.ObjectId(resp._id) });

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
        dishMap[dish._id] = dish;
      });

      const orderDishes = nOrder.orderitems.map((item) => ({
        ...item._doc,
        dish: dishMap[item.dishId],
      }));

      res.status(200).json({
        ...nOrder._doc,
        address: response.data,
        orderitems: orderDishes,
        restaurant: resResp.data,
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json(errors.serverError);
  }
};

const updateOrderStatus = async (req, res) => {
  const { user, role } = req.headers;
  const { id } = req.params;

  const valErr = validationResult(req);
  if (!valErr.isEmpty()) {
    console.error(valErr);
    res.status(400).json({ status: 400, message: valErr.array() });
    return;
  }

  const { status } = req.body;

  const whereQ = {
    _id: Types.ObjectId(id),
  };
  if (role === 'customer') {
    whereQ.customerId = Types.ObjectId(user);
  } else if (role === 'restaurant') {
    whereQ.restaurantId = Types.ObjectId(user);
  }

  const order = await Order.findOne(whereQ);
  if (!order) {
    res.status(404).json(errors.notFound);
    return;
  }

  if (role === 'customer' && status !== 'CANCEL') {
    res.status(400).json(errors.badRequest);
    return;
  }

  if (role === 'customer' && order.status != 'PLACED') {
    res
      .status(400)
      .json({ ...errors.badRequest, message: 'Cannot cancel order once the order is processed' });
    return;
  }

  try {
    makeRequest('order.updatestatus', { id: order._id, status }, async (err, resp) => {
      const nOrder = await Order.findOne({ _id: Types.ObjectId(resp._id) });
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
        dishMap[dish._id] = dish;
      });

      const orderDishes = nOrder.orderitems.map((item) => ({
        ...item._doc,
        dish: dishMap[item.dishId],
      }));

      const result = {
        ...nOrder._doc,
        orderitems: orderDishes,
        restaurant: resResp.data,
      };

      const addressMap = await getAddresses();

      if (order.addressId) {
        result.address = addressMap[order.addressId];
      }

      res.status(200).json(result);
    });
  } catch (err) {
    console.error(err);
    res.status(500).json(errors.serverError);
  }
};

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  placeOrder,
  updateOrderStatus,
  getAllRestaurantsOrder,
};
