/* eslint-disable no-underscore-dangle */
/* eslint-disable eqeqeq */
const { default: axios } = require('axios');
const { validationResult } = require('express-validator');
const { Types } = require('mongoose');
const { CartItem } = require('../model');
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

    makeRequest(
      'cartitem.create',
      {
        customerId: user,
        dishId: req.body.dishId,
        restaurantId: req.body.restaurantId,
        quantity: req.body.quantity,
        notes: req.body.notes,
      },
      (err, resp) => {
        if (err || !resp) {
          res.status(500).json(errors.serverError);
          return;
        }
        const result = {
          _id: resp._id,
          restaurantId: resp.restaurantId,
          restaurant,
          dishId: resp.dishId,
          dish: dishMap[resp.dishId],
          quantity: resp.quantity,
          notes: resp.notes,
        };

        res.status(201).json(result);
      },
    );
  } catch (err) {
    console.log(err);
    if (err.isAxiosError) {
      res.status(500).json({ ...errors.serverError, message: err.message });
      return;
    }
    res.status(500).json(errors.serverError);
  }
};

const updateCartItem = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    res.status(400).json(errors.badRequest);
    return;
  }

  const { user } = req.headers;
  const { notes, quantity, restaurantId } = req.body;

  try {
    const cartItem = await CartItem.findOne({
      _id: id,
      customerId: Types.ObjectId(user),
      restaurantId: Types.ObjectId(restaurantId),
    });
    if (!cartItem) {
      res.status(404).json(errors.notFound);
      return;
    }

    cartItem.notes = notes;
    cartItem.quantity = quantity;

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

    makeRequest('cartitem.update', { id: cartItem._id, data: cartItem }, async (err, resp) => {
      if (err || !resp) {
        res.status(500).json(errors.serverError);
        return;
      }

      const result = await CartItem.findOne({ _id: Types.ObjectId(resp._id) });
      res.status(200).json({ ...result._doc, dish: dishMap[cartItem.dishId] });
    });

    return;
  } catch (err) {
    console.error(err);
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

  const cartItem = await CartItem.findOne({ _id: id, customerId: Types.ObjectId(user) });
  if (!cartItem) {
    res.status(404).json(errors.notFound);
    return;
  }

  makeRequest('cartitem.delete', { id: cartItem._id }, (err, resp) => {
    if (err || !resp) {
      res.status(500).json(errors.serverError);
      return;
    }

    if (resp.success) {
      res.status(200).json(null);
    } else {
      res.status(500).json(errors.serverError);
    }
  });
};

const resetCartItems = async (req, res) => {
  const { user } = req.headers;

  makeRequest('cartitem.reset', { customerId: user }, (err, resp) => {
    if (err || !resp) {
      res.status(500).json(errors.serverError);
      return;
    }

    if (resp.success) {
      res.status(200).json(null);
    } else {
      res.status(500).json(errors.serverError);
    }
  });
};

module.exports = {
  getAllCartItems,
  addCartItem,
  deleteCartItem,
  resetCartItems,
  updateCartItem,
};
