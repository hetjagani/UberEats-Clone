/* eslint-disable no-underscore-dangle */
/* eslint-disable eqeqeq */
const { default: axios } = require('axios');
const { validationResult } = require('express-validator');
const { Types } = require('mongoose');
const { Customer } = require('../model');
const errors = require('../util/errors');

const getRestaurants = async (favs, auth) => {
  const res = await axios.get(`${global.gConfig.restaurant_url}/restaurants/all`, {
    headers: { Authorization: auth },
  });

  const map = {};
  res.data.forEach((ele) => {
    map[ele._id] = ele;
  });

  const restaurants = favs.map((ele) => ({
    restaurantId: ele,
    restaurant: map[ele],
  }));

  return restaurants;
};

const getCustomerFavourites = async (req, res) => {
  const { user } = req.headers;
  const customer = await Customer.findOne({ where: { _id: user } });
  if (!customer) {
    res.status(404).json(errors.notFound);
    return;
  }
  const restaurants = await getRestaurants(customer.favourites, req.headers.authorization);

  res.status(200).json(restaurants);
};

const createCustomerFavourite = async (req, res) => {
  const valErr = validationResult(req);
  if (!valErr.isEmpty()) {
    console.error(valErr);
    res.status(400).json({ status: 400, message: valErr.array() });
    return;
  }

  const { user } = req.headers;
  const auth = req.headers.authorization;
  const { restaurantId } = req.body;

  if (restaurantId == '') {
    res.status(400).json(errors.badRequest);
    return;
  }

  // check if restaurant exist
  try {
    const resp = await axios.get(`${global.gConfig.restaurant_url}/restaurants/${restaurantId}`, {
      headers: { Authorization: auth },
    });

    await Customer.update(
      {
        customerId: Types.ObjectId(user),
      },
      { $push: { favourites: restaurantId } },
    );

    res.status(201).json({
      restaurantId,
      restaurant: resp.data,
      customerId: user,
    });
    return;
  } catch (err) {
    console.error(err.toJSON());
    if (err.original) {
      res.status(500).json({ status: 500, message: err.original.sqlMessage });
    } else if (err.toJSON().message) {
      res.status(500).json({ message: err.toJSON().message });
    } else {
      res.status(500).json(errors.serverError);
    }
  }
};

const deleteCustomerFavourite = async (req, res) => {
  const { user } = req.headers;
  const { favID } = req.params;

  try {
    await Customer.update({ _id: user }, { $pull: { favourites: favID } });

    res.status(200).send(null);
    return;
  } catch (err) {
    console.error(err);
    res.status(500).json(errors.serverError);
  }
};

module.exports = {
  getCustomerFavourites,
  createCustomerFavourite,
  deleteCustomerFavourite,
};
