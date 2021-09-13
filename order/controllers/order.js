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

const getAllOrders = async (req, res) => {
  const { user } = req.headers;

  const orders = await Order.findAll({
    where: { customerId: user },
    include: [OrderItem],
  });

  try {
    // get all restaurants
    const restaurantMap = await getRestaurants(req.headers.authorization);

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
      };
    });

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json(errors.serverError);
  }
};

const getOrderById = async (req, res) => {};

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
    if (err.original) {
      res.status(500).json({ status: 500, message: err.original.sqlMessage });
    } else {
      res.status(500).json(errors.serverError);
    }
  }
};

const deleteOrder = async (req, res) => {};

const updateOrderStatus = async (req, res) => {};

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  deleteOrder,
  updateOrderStatus,
};
