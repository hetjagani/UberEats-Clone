/* eslint-disable no-underscore-dangle */
/* eslint-disable eqeqeq */
const { validationResult } = require('express-validator');
const { Types } = require('mongoose');
const { getPaiganation } = require('u-server-utils');
const { Dish, Restaurant } = require('../model');
const errors = require('../util/errors');
const { sendData } = require('../util/kafka/topics');

const getDishesForRestaurant = async (req, res) => {
  const { resID } = req.params;
  if (!resID) {
    res.status(400).json(errors.badRequest);
    return;
  }

  const { limit, offset } = getPaiganation(req.query.page, req.query.limit);

  try {
    const dishCount = await Dish.count({ restaurantId: resID });
    const dishes = await Dish.find({ restaurantId: resID }).skip(offset).limit(limit);
    res.status(200).json({ total: dishCount, nodes: dishes });
  } catch (e) {
    console.log(e);
    res.status(500).json(errors.serverError);
  }
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

  try {
    const dish = await Dish.findOne({ _id: dishID, restaurantId: resID });
    if (!dish) {
      res.status(404).json(errors.notFound);
      return;
    }

    res.status(200).json(dish);
  } catch (e) {
    console.error(e);
    res.status(500).json(errors.serverError);
  }
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

  try {
    const restaurant = await Restaurant.findOne({ _id: resID });
    if (!restaurant) {
      res.status(404).json({ ...errors.notFound, message: 'restaurant not found' });
      return;
    }

    const dish = req.body;
    dish.restaurantId = resID;
    sendData('dish.create', dish, async (err, resp) => {
      try {
        if (err) {
          res.status(500).json(errors.serverError);
          return;
        }

        const result = await Dish.findOne({ _id: Types.ObjectId(resp._id) });

        res.status(201).json(result);
        Promise.resolve(result);
      } catch (e) {
        console.error(e);
      }
    });
  } catch (e) {
    console.error(e);
    res.status(500).json(errors.serverError);
  }
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

  try {
    const dbRes = await Dish.findOneAndUpdate({ _id: dishID, restaurantId: resID }, dish);
    if (!dbRes) {
      res.status(404).json({ ...errors.notFound, message: 'dish not found for restaurant' });
      return;
    }

    const result = await Dish.findOne({ _id: dbRes._id });

    res.status(200).json(result);
  } catch (e) {
    console.error(e);
    res.status(500).json(errors.serverError);
  }
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

  try {
    const dish = await Dish.findOneAndDelete({ _id: dishID, restaurantId: resID });
    if (!dish) {
      res.status(404).json({ ...errors.notFound, message: 'dish not found for restaurant' });
      return;
    }

    await Restaurant.update({ _id: resID }, { $pull: { dishes: dish._id } });

    res.status(200).send(null);
  } catch (e) {
    console.error(e);
    res.status(500).json(errors.serverError);
  }
};

module.exports = {
  getDishesForRestaurant,
  getDishForRestaurantByID,
  createDishForRestaurant,
  updateDishInRestaurant,
  deleteDishInRestaurant,
};
