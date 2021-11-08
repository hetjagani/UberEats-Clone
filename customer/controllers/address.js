/* eslint-disable no-underscore-dangle */
/* eslint-disable eqeqeq */
const { validationResult } = require('express-validator');
const { Types } = require('mongoose');
const { Address } = require('../model');
const errors = require('../util/errors');
const { makeRequest } = require('../util/kafka/client');

// NOTE: not done paiganation for addresses
const getAllAddresses = async (req, res) => {
  const { user } = req.headers;
  const addresses = await Address.find({ customerId: Types.ObjectId(user) });

  res.status(200).json(addresses);
};

// admin endpoint
const getAllAddressesForRestaurant = async (req, res) => {
  const addresses = await Address.find({});

  res.status(200).json(addresses);
};

const getAddressByID = async (req, res) => {
  const id = req.params.addID;
  if (!id || id == 0) {
    res.status(400).json(errors.badRequest);
    return;
  }

  const { user } = req.headers;

  try {
    const address = await Address.findOne({ customerId: user, _id: id });
    if (!address) {
      res.status(404).json(errors.notFound);
      return;
    }

    res.status(200).json(address);
  } catch (e) {
    console.log(e);
    res.status(500).json(errors.serverError);
  }
};

const createAddress = async (req, res) => {
  const valErr = validationResult(req);
  if (!valErr.isEmpty()) {
    console.error(valErr);
    res.status(400).json({ status: 400, message: valErr.array() });
    return;
  }

  const { user } = req.headers;
  const address = req.body;

  makeRequest('address.create', { customerId: user, address }, async (err, resp) => {
    if (err || !resp) {
      res.status(500).json(errors.serverError);
      return;
    }
    const result = await Address.findOne({ _id: resp._id });

    res.status(201).json(result);
  });
};

const updateAddress = async (req, res) => {
  const id = req.params.addID;
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

  const { user } = req.headers;
  const address = req.body;

  const dbRes = await Address.findOne({ _id: id, customerId: user });
  if (!dbRes) {
    res.status(404).json(errors.notFound);
    return;
  }

  makeRequest(
    'address.update',
    { id: dbRes._id, address: { ...address, customerId: Types.ObjectId(user) } },
    async (err, resp) => {
      if (err || !resp) {
        res.status(500).json(errors.serverError);
        return;
      }
      const result = await Address.findOne({ _id: resp._id });

      res.status(200).json(result);
    },
  );
};

const deleteAddress = async (req, res) => {
  const id = req.params.addID;
  if (!id || id == 0) {
    res.status(400).json(errors.badRequest);
    return;
  }

  const { user } = req.headers;
  const address = await Address.findOne({ _id: id, customerId: Types.ObjectId(user) });
  if (!address) {
    res.status(404).json(errors.notFound);
    return;
  }

  makeRequest('address.delete', { id, customerId: user }, (err, resp) => {
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
  getAllAddresses,
  getAddressByID,
  createAddress,
  updateAddress,
  deleteAddress,
  getAllAddressesForRestaurant,
};
