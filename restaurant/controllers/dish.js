/* eslint-disable no-underscore-dangle */
/* eslint-disable eqeqeq */
const { validationResult } = require('express-validator');
const { Dish, Restaurant, Media } = require('../model');
const errors = require('../util/errors');
const { getPaiganation } = require('u-server-utils');

const getDishesForRestaurant = async (req, res) => {
  const { resID } = req.params;
  if (!resID || resID == 'undefined') {
    res.status(400).json(errors.badRequest);
    return;
  }

  const { limit, offset } = getPaiganation(req.query.page, req.query.limit);

  const dishCount = await Dish.count({ restaurantId: resID });
  const dishes = await Dish.find({ restaurantId: resID }).skip(offset).limit(limit);

  res.status(200).json({ total: dishCount, nodes: dishes });
};

const getDishForRestaurantByID = async (req, res) => {
  const { resID } = req.params;
  if (!resID || resID == 0) {
    res.status(400).json(errors.badRequest);
    return;
  }

  const { dishID } = req.params;
  if (!dishID || dishID == 0) {
    res.status(400).json(errors.badRequest);
    return;
  }

  const dish = await Dish.findOne({ _id: dishID, restaurantId: resID });
  if (!dish) {
    res.status(404).json(errors.notFound);
    return;
  }

  res.status(200).json(dish);
};

const createDishForRestaurant = async (req, res) => {
  const { resID } = req.params;
  if (!resID || resID == 0) {
    res.status(400).json(errors.badRequest);
    return;
  }

  const valErr = validationResult(req);
  if (!valErr.isEmpty()) {
    console.error(valErr);
    res.status(400).json({ status: 400, message: valErr.array() });
    return;
  }

  const restaurant = await Restaurant.findOne({ _id: resID });
  if (!restaurant) {
    res.status(404).json({ ...errors.notFound, message: 'restaurant not found' });
    return;
  }

  const dish = req.body;
  dish.restaurantId = resID;
  const createdRes = await Dish.create(dish);

  restaurant.dishes.push(createdRes._id);
  await restaurant.save();
  res.status(201).json(createdRes);
};

const updateDishInRestaurant = async (req, res) => {
  const { resID } = req.params;
  if (!resID || resID == 0) {
    res.status(400).json(errors.badRequest);
    return;
  }

  const { dishID } = req.params;
  if (!dishID || dishID == 0) {
    res.status(400).json(errors.badRequest);
    return;
  }

  const valErr = validationResult(req);
  if (!valErr.isEmpty()) {
    console.error(valErr);
    res.status(400).json({ status: 400, message: valErr.array() });
    return;
  }

  const dish = req.body;
  if (!dish.media || dish.media?.length == 0) {
    dish.media = [];
  }

  dish.restaurantId = resID;

  const dbRes = await Dish.findOneAndUpdate({ _id: dishID, restaurantId: resID }, dish);
  if (!dbRes) {
    res.status(404).json({ ...errors.notFound, message: 'dish not found for restaurant' });
    return;
  }

  const result = await Dish.findOne({ _id: dbRes._id });

  res.status(200).json(result);
};

const deleteDishInRestaurant = async (req, res) => {
  const { resID } = req.params;
  if (!resID || resID == 0) {
    res.status(400).json(errors.badRequest);
    return;
  }

  const { dishID } = req.params;
  if (!dishID || dishID == 0) {
    res.status(400).json(errors.badRequest);
    return;
  }

  const dish = await Dish.findOneAndDelete({ _id: dishID, restaurantId: resID });
  if (!dish) {
    res.status(404).json({ ...errors.notFound, message: 'dish not found for restaurant' });
    return;
  }

  res.status(200).send(null);
};

module.exports = {
  getDishesForRestaurant,
  getDishForRestaurantByID,
  createDishForRestaurant,
  updateDishInRestaurant,
  deleteDishInRestaurant,
};
