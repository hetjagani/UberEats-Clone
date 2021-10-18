/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-expressions */
/* eslint-disable camelcase */
/* eslint-disable eqeqeq */
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');
const { Restaurant, Media, Dish } = require('../model');
const errors = require('../util/errors');
const getPaiganation = require('../util/paiganation');

const allRestaurants = async (req, res) => {
  const restaurants = await Restaurant.findAll({ include: [Media, Dish] });

  res.status(200).json(restaurants);
};

const getAllRestaurants = async (req, res) => {
  const whereOpts = [];
  const { address, city, restaurant_type, food_type, q } = req.query;
  if (address && address != '') {
    whereOpts.push({ address: { $regex: `*${address}*` } });
  }

  if (city && city != '') {
    whereOpts.push({ city });
  }

  if (restaurant_type && restaurant_type != '') {
    whereOpts.push({ restaurant_type });
  }

  if (food_type && food_type != '') {
    whereOpts.push({ food_type });
  }

  const orQuery = [];
  if (q && q != '') {
    orQuery.push({ name: { $regex: `*${q}*` } });
    orQuery.push({ description: { $regex: `*${q}*` } });
  }

  orQuery.length && whereOpts.push(orQuery);

  let query = {};
  if (whereOpts.length > 0) {
    query = { $and: whereOpts };
  }

  const { limit, offset } = getPaiganation(req.query.page, req.query.limit);
  const resCount = await Restaurant.count(query).skip(offset).limit(limit);
  const restaurants = await Restaurant.find(query).skip(offset).limit(limit);

  res.status(200).json({ total: resCount, nodes: restaurants });
};

const getRestaurantByID = async (req, res) => {
  const { id } = req.params;
  if (!id || id == 0) {
    res.status(400).json(errors.badRequest);
    return;
  }

  const restaurant = await Restaurant.findOne({
    _id: id,
  });
  if (!restaurant) {
    res.status(404).send(errors.notFound);
    return;
  }

  res.status(200).json(restaurant);
};

const createRestaurant = async (req, res) => {
  const { user } = req.headers;
  if (user !== req.body.id) {
    res.status(400).json({
      ...errors.badRequest,
      message: 'restaurant.id in body should be same as logged in user',
    });
    return;
  }

  const valErr = validationResult(req);
  if (!valErr.isEmpty()) {
    console.error(valErr);
    res.status(400).json({ status: 400, message: valErr.array() });
    return;
  }

  const restaurant = req.body;
  restaurant._id = restaurant.id;

  try {
    const createdRes = await Restaurant.create(restaurant);

    res.status(201).json(createdRes);
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

const updateRestaurantByID = async (req, res) => {
  const { id } = req.params;
  if (!id || id == 0) {
    res.status(400).json(errors.badRequest);
    return;
  }

  const { user } = req.headers;
  if (user != id) {
    res.status(400).json({
      ...errors.badRequest,
      message: 'id should be same as logged in user',
    });
    return;
  }

  const valErr = validationResult(req);
  if (!valErr.isEmpty()) {
    console.error(valErr);
    res.status(400).json({ status: 400, message: valErr.array() });
    return;
  }

  const restaurant = req.body;
  if (!restaurant.media || restaurant.media?.length == 0) {
    restaurant.media = [];
  }

  const dbRes = await Restaurant.findOneAndUpdate({ _id: id }, restaurant);
  if (!dbRes) {
    res.status(404).json(errors.notFound);
    return;
  }

  const result = await Restaurant.findOne({ _id: dbRes._id });

  res.status(200).json(result);
};

const deleteRestaurant = async (req, res) => {
  const { id } = req.params;
  if (!id || id == 0) {
    res.status(400).json(errors.badRequest);
    return;
  }

  const restaurant = await Restaurant.findOneAndRemove({ _id: id });
  if (!restaurant) {
    res.status(401).send(errors.notFound);
    return;
  }

  res.status(200).send(null);
};

module.exports = {
  allRestaurants,
  getAllRestaurants,
  getRestaurantByID,
  createRestaurant,
  updateRestaurantByID,
  deleteRestaurant,
};
