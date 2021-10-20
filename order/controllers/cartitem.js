/* eslint-disable no-underscore-dangle */
/* eslint-disable eqeqeq */
const { default: axios } = require('axios');
const { validationResult } = require('express-validator');
const { Types } = require('mongoose');
const { CartItem } = require('../model');
const errors = require('../util/errors');

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

const getAllCartItems = async (req, res) => {
  const { user } = req.headers;

  const cartItems = await CartItem.find({ customerId: Types.ObjectId(user) });

  if (!cartItems || cartItems.length == 0) {
    res.status(200).json([]);
    return;
  }

  const { restaurantId } = cartItems[0];

  try {
    const response = await axios.get(
      `${global.gConfig.restaurant_url}/restaurants/${restaurantId}`,
      { headers: { authorization: req.headers.authorization } },
    );

    if (!response) {
      res.status(404).json(errors.notFound);
      return;
    }

    const restaurant = response.data;

    const dishMap = {};
    restaurant.dishes.forEach((ele) => {
      dishMap[ele._id] = ele;
    });

    const result = cartItems.map((ele) => ({
      _id: ele._id,
      restaurantId: ele.restaurantId,
      restaurant,
      dishId: ele.dishId,
      dish: dishMap[ele.dishId],
      quantity: ele.quantity,
      notes: ele.notes,
    }));

    res.status(200).json(result);
    return;
  } catch (err) {
    console.log(err);
    res.status(500).json(errors.serverError);
  }
};

const addCartItem = async (req, res) => {
  const { user } = req.headers;

  const valErr = validationResult(req);
  if (!valErr.isEmpty()) {
    console.error(valErr);
    res.status(400).json({ status: 400, message: valErr.array() });
    return;
  }

  // fetch that restaurant and check if the dish is present
  try {
    const restaurants = await getRestaurants(req.headers.authorization);

    const cartItem = await CartItem.findOne({ customerId: Types.ObjectId(user) });

    if (cartItem && cartItem.restaurantId != req.body.restaurantId) {
      res.status(400).json({
        status: 400,
        type: 'diff_restaurant',
        message: `Trying to add dish from <strong>${
          restaurants[req.body.restaurantId].name
        }</strong> but cart has dishes for <strong>${
          restaurants[cartItem.restaurantId].name
        }</strong>`,
        time: Date.now(),
      });
      return;
    }

    const restaurant = restaurants[req.body.restaurantId];
    if (!restaurant) {
      res.status(404).json(errors.notFound);
      return;
    }

    const dishMap = {};
    restaurant.dishes.forEach((ele) => {
      dishMap[ele._id] = ele;
    });

    if (!dishMap[req.body.dishId]) {
      res.status(404).json({ ...errors.notFound, message: 'dish not found for restaurant' });
      return;
    }

    const nCartItem = await CartItem.create({
      customerId: user,
      dishId: req.body.dishId,
      restaurantId: req.body.restaurantId,
      quantity: req.body.quantity,
      notes: req.body.notes,
    });

    const result = {
      _id: nCartItem._id,
      restaurantId: nCartItem.restaurantId,
      restaurant,
      dishId: nCartItem.dishId,
      dish: dishMap[nCartItem.dishId],
      quantity: nCartItem.quantity,
      notes: nCartItem.notes,
    };

    res.status(201).json(result);
    return;
  } catch (err) {
    console.log(err);
    if (err.isAxiosError) {
      res.status(500).json({ ...errors.serverError, message: err.message });
      return;
    }
    res.status(500).json(errors.serverError);
  }
};

const deleteCartItem = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    res.status(400).json(errors.badRequest);
    return;
  }

  const { user } = req.headers;

  try {
    const cartItem = await CartItem.findOneAndDelete({ _id: id, customerId: Types.ObjectId(user) });
    if (!cartItem) {
      res.status(404).json(errors.notFound);
      return;
    }

    res.status(200).json(null);
    return;
  } catch (err) {
    console.error(err);
    res.status(500).json(errors.serverError);
  }
};

const resetCartItems = async (req, res) => {
  const { user } = req.headers;

  try {
    await CartItem.deleteMany({ customerId: Types.ObjectId(user) });
    res.status(200).json(null);
    return;
  } catch (err) {
    console.error(err);
    res.status(500).json(errors.serverError);
  }
};

module.exports = {
  getAllCartItems,
  addCartItem,
  deleteCartItem,
  resetCartItems,
};
