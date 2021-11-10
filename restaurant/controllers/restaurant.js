/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-expressions */
/* eslint-disable camelcase */
/* eslint-disable eqeqeq */
const { validationResult } = require('express-validator');
const { getPaiganation } = require('u-server-utils');
const { Types } = require('mongoose');
const { Restaurant } = require('../model');
const errors = require('../util/errors');
const { makeRequest } = require('../util/kafka/client');

const allRestaurants = async (req, res) => {
  const restaurants = await Restaurant.aggregate([
    {
      $lookup: {
        from: 'dishes',
        localField: 'dishes',
        foreignField: '_id',
        as: 'dishes',
      },
    },
  ]);

  res.status(200).json(restaurants);
};

const getAllRestaurants = async (req, res) => {
  const whereOpts = [];
  const { address, city, restaurant_type, food_type, q } = req.query;
  if (address && address != '') {
    whereOpts.push({ address: { $regex: `(?i)(?<= |^)${address}(?= |$)` } });
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
    orQuery.push({ name: { $regex: `(?i)(?<= |^)${q}(?= |$)` } });
    orQuery.push({ description: { $regex: `(?i)(?<= |^)${q}(?= |$)` } });
  }

  orQuery.length && whereOpts.push({ $or: orQuery });

  let query = {};
  if (whereOpts.length > 0) {
    query = { $and: whereOpts };
  }

  const { limit, offset } = getPaiganation(req.query.page, req.query.limit);

  const resCount = await Restaurant.count(query).skip(offset).limit(limit);
  const restaurants = await Restaurant.aggregate([
    {
      $lookup: {
        from: 'dishes',
        localField: 'dishes',
        foreignField: '_id',
        as: 'dishes',
      },
    },
    { $match: query },
  ])
    .skip(offset)
    .limit(limit);

  res.status(200).json({ total: resCount, nodes: restaurants });
};

const getRestaurantByID = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    res.status(400).json(errors.badRequest);
    return;
  }

  try {
    const restaurants = await Restaurant.aggregate([
      { $match: { _id: Types.ObjectId(id) } },
      {
        $lookup: {
          from: 'dishes',
          localField: 'dishes',
          foreignField: '_id',
          as: 'dishes',
        },
      },
    ]);
    if (!restaurants || restaurants?.length < 1) {
      res.status(404).send(errors.notFound);
      return;
    }

    res.status(200).json(restaurants[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json(errors.serverError);
  }
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

  makeRequest('restaurant.create', restaurant, async (err, resp) => {
    if (err || !resp) {
      res.status(500).json(errors.serverError);
      return;
    }
    const result = await Restaurant.aggregate([
      { $match: { _id: Types.ObjectId(resp._id) } },
      {
        $lookup: {
          from: 'dishes',
          localField: 'dishes',
          foreignField: '_id',
          as: 'dishes',
        },
      },
    ]);

    res.status(201).json(result[0]);
  });
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

  const dbRes = await Restaurant.findOne({ _id: id });
  if (!dbRes) {
    res.status(404).json(errors.notFound);
    return;
  }

  makeRequest('restaurant.update', { id: dbRes._id, data: restaurant }, async (err, resp) => {
    if (err || !resp) {
      res.status(500).json(errors.serverError);
      return;
    }
    const result = await Restaurant.aggregate([
      { $match: { _id: Types.ObjectId(resp._id) } },
      {
        $lookup: {
          from: 'dishes',
          localField: 'dishes',
          foreignField: '_id',
          as: 'dishes',
        },
      },
    ]);

    res.status(200).json(result[0]);
  });
};

const deleteRestaurant = async (req, res) => {
  const { id } = req.params;
  if (!id || id == 0) {
    res.status(400).json(errors.badRequest);
    return;
  }

  const restaurant = await Restaurant.findOne({ _id: Types.ObjectId(id) });
  if (!restaurant) {
    res.status(404).send(errors.notFound);
    return;
  }

  makeRequest('restaurant.delete', { id: restaurant._id }, async (err, resp) => {
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
  allRestaurants,
  getAllRestaurants,
  getRestaurantByID,
  createRestaurant,
  updateRestaurantByID,
  deleteRestaurant,
};
