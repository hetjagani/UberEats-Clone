/* eslint-disable no-underscore-dangle */
/* eslint-disable eqeqeq */
const { default: axios } = require('axios');
const { validationResult } = require('express-validator');
const { Types } = require('mongoose');
const { Customer } = require('../model');
const errors = require('../util/errors');
const getPaiganation = require('../util/paiganation');
const { makeRequest } = require('../util/kafka/client');

const getFavouriteRestaurants = async (favs, auth) => {
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

// get all customers of a restaurant
const getAllCustomers = async (req, res) => {
  const { authorization } = req.headers;
  let { q } = req.query;
  if (!q) {
    q = '';
  }
  try {
    // fetch all restaurant's orders from orders service
    const orderRes = await axios.get(`${global.gConfig.order_url}/orders/all`, {
      headers: { Authorization: authorization },
    });

    // get all customer ids from all orders and return those customers
    const customerIds = [];
    orderRes.data.forEach((order) => {
      if (order.status != 'INIT') customerIds.push(Types.ObjectId(order.customerId));
    });

    const { limit, offset } = getPaiganation(req.query.page, req.query.limit);

    let nameQ = {};
    if (q != '') {
      nameQ = { name: { $regex: `(?i)(?<= |^)${q}(?= |$)` } };
    }
    const cusCount = await Customer.count({ $and: [{ _id: { $in: customerIds } }, nameQ] });
    const customers = await Customer.aggregate([
      {
        $lookup: {
          from: 'addresses',
          localField: 'addresses',
          foreignField: '_id',
          as: 'addresses',
        },
      },
      {
        $match: {
          $and: [{ _id: { $in: customerIds } }, nameQ],
        },
      },
    ])
      .skip(offset)
      .limit(limit);

    res.status(200).json({ total: cusCount, nodes: customers });
  } catch (err) {
    console.error(err);
    res.status(500).json(errors.serverError);
  }
};

const getCustomerByID = async (req, res) => {
  const { id } = req.params;
  if (!id || id === 0) {
    res.status(400).json(errors.badRequest);
    return;
  }

  const { authorization } = req.headers;

  if (id != req.headers.user) {
    res.status(401).json(errors.unauthorized);
    return;
  }

  const customers = await Customer.aggregate([
    {
      $lookup: {
        from: 'addresses',
        localField: 'addresses',
        foreignField: '_id',
        as: 'addresses',
      },
    },
    {
      $match: {
        _id: Types.ObjectId(id),
      },
    },
  ]);
  if (!customers || customers.length == 0) {
    res.status(404).send(errors.notFound);
    return;
  }

  const customer = customers[0];
  if (customer.favourites.length > 0) {
    customer.favourites = await getFavouriteRestaurants(customer.favourites, authorization);
  }

  res.status(200).json(customer);
};

const createCustomer = async (req, res) => {
  const { user } = req.headers;
  if (user !== req.body.id) {
    res.status(400).json({
      ...errors.badRequest,
      message: 'customer.id in body should be same as logged in user',
    });
    return;
  }

  const valErr = validationResult(req);
  if (!valErr.isEmpty()) {
    console.error(valErr);
    res.status(400).json({ status: 400, message: valErr.array() });
    return;
  }

  const customer = req.body;
  customer._id = customer.id;

  makeRequest('customer.create', customer, async (err, resp) => {
    if (err || !resp) {
      res.status(500).json(errors.serverError);
      return;
    }
    const result = await Customer.findOne({ _id: Types.ObjectId(resp._id) });

    res.status(201).json(result);
  });
};

const updateCustomerByID = async (req, res) => {
  const { user } = req.headers;
  if (user !== req.body.id) {
    res.status(400).json({
      ...errors.badRequest,
      message: 'customer.id in body should be same as logged in user',
    });
    return;
  }
  const { id } = req.params;
  if (!id || id == 0) {
    res.status(400).json(errors.badRequest);
    return;
  }

  const valErr = validationResult(req);
  if (!valErr.isEmpty()) {
    console.error(valErr);
    res.status(400).json({ status: 400, message: valErr.array() });
    return;
  }

  const customer = req.body;

  const dbRes = await Customer.findOne({ _id: id }, customer);
  if (!dbRes) {
    res.status(404).json(errors.notFound);
    return;
  }

  makeRequest('customer.update', { id: dbRes._id, data: customer }, async (err, resp) => {
    if (err || !resp) {
      res.status(500).json(errors.serverError);
      return;
    }

    const customers = await Customer.aggregate([
      {
        $lookup: {
          from: 'addresses',
          localField: 'addresses',
          foreignField: '_id',
          as: 'addresses',
        },
      },
      {
        $match: {
          _id: dbRes._id,
        },
      },
    ]);

    res.status(200).json(customers[0]);
  });
};

const deleteCustomerByID = async (req, res) => {
  const { id } = req.params;
  if (!id || id == 0) {
    res.status(400).json(errors.badRequest);
    return;
  }

  const customer = await Customer.findOne({ _id: id });
  if (!customer) {
    res.status(404).send(errors.notFound);
    return;
  }

  makeRequest('customer.delete', { id: customer._id }, (err, resp) => {
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
  getAllCustomers,
  getCustomerByID,
  createCustomer,
  updateCustomerByID,
  deleteCustomerByID,
};
