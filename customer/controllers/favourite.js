/* eslint-disable eqeqeq */
const { default: axios } = require('axios');
const { validationResult } = require('express-validator');
const { Favourite } = require('../model');
const errors = require('../util/errors');

const getRestaurants = async (favs, auth) => {
  const res = await axios.get(`${global.gConfig.restaurant_url}/restaurants/all`, {
    headers: { Authorization: auth },
  });

  const map = {};
  res.data.forEach((ele) => {
    map[ele.id] = ele;
  });

  const restaurants = favs.map((ele) => ({
    id: ele.id,
    restaurantId: ele.restaurantId,
    restaurant: map[ele.restaurantId],
    customerId: ele.customerId,
  }));

  return restaurants;
};

// NOTE: not done paiganation for favourites
const getCustomerFavourites = async (req, res) => {
  const { user } = req.headers;
  const favourites = await Favourite.findAll({ where: { customerId: user } });
  const restaurants = await getRestaurants(favourites, req.headers.authorization);

  res.status(200).json(restaurants);
};

const getCustomerFavouriteByID = async (req, res) => {
  const { user } = req.headers;
  const { favID } = req.params;
  if (!favID || favID == 0) {
    res.status(400).json(errors.badRequest);
    return;
  }

  const favourite = await Favourite.findOne({ where: { id: favID, customerId: user } });
  const restaurants = await getRestaurants([favourite], req.headers.authorization);

  res.status(200).json(...restaurants);
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
  const favBody = req.body;

  if (favBody.restaurantId == 0) {
    res.status(400).json(errors.badRequest);
    return;
  }

  // check if restaurant exist
  try {
    const resp = await axios.get(
      `${global.gConfig.restaurant_url}/restaurants/${favBody.restaurantId}`,
      {
        headers: { Authorization: auth },
      },
    );

    const favourite = await Favourite.create({
      customerId: user,
      restaurantId: favBody.restaurantId,
    });

    res.status(201).json({
      id: favourite.id,
      restaurantId: favourite.restaurantId,
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

  const favourite = await Favourite.findOne({ where: { restaurantId: favID, customerId: user } });

  try {
    await favourite.destroy();
    res.status(200).send(null);
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
  getCustomerFavourites,
  getCustomerFavouriteByID,
  createCustomerFavourite,
  deleteCustomerFavourite,
};
