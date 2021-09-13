/* eslint-disable eqeqeq */
const { default: axios } = require('axios');
const { validationResult } = require('express-validator');
const { CartItem } = require('../model');
const errors = require('../util/errors');

const getAllCartItems = async (req, res) => {
  const { user } = req.headers;

  const cartItems = await CartItem.findAll({ where: { customerId: user } });

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
      dishMap[ele.id] = ele;
    });

    const result = cartItems.map((ele) => ({
      id: ele.id,
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

  const cartItem = await CartItem.findOne({ where: { customerId: user } });

  if (cartItem && cartItem.restaurantId != req.body.restaurantId) {
    res.status(400).json({
      status: 400,
      message: `trying to add ${req.body.restaurantId} but cart has dishes for ${cartItem.restaurantId}`,
    });
    return;
  }

  // fetch that restaurant and check if the dish is present
  try {
    const response = await axios.get(
      `${global.gConfig.restaurant_url}/restaurants/${req.body.restaurantId}`,
      { headers: { authorization: req.headers.authorization } },
    );

    if (!response) {
      res.status(404).json(errors.notFound);
      return;
    }

    const restaurant = response.data;

    const dishMap = {};
    restaurant.dishes.forEach((ele) => {
      dishMap[ele.id] = ele;
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
      id: nCartItem.id,
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
  if (!id || id == 0) {
    res.status(400).json(errors.badRequest);
    return;
  }

  const { user } = req.headers;

  const cartItem = await CartItem.findOne({ where: { id, customerId: user } });
  if (!cartItem) {
    res.status(404).json(errors.notFound);
    return;
  }

  try {
    await cartItem.destroy();
    res.status(200).json(null);
    return;
  } catch (err) {
    console.error(err);
    if (err.original) {
      res.status(500).json({ status: 500, message: err.original.sqlMessage });
    } else {
      res.status(500).json(errors.serverError);
    }
  }
};

const resetCartItems = async (req, res) => {
  const { user } = req.headers;

  try {
    await CartItem.destroy({ where: { customerId: user } });
    res.status(200).json(null);
    return;
  } catch (err) {
    console.error(err);
    if (err.original) {
      res.status(500).json({ status: 500, message: err.original.sqlMessage });
    } else {
      res.status(500).json(errors.serverError);
    }
  }
};

module.exports = {
  getAllCartItems,
  addCartItem,
  deleteCartItem,
  resetCartItems,
};
