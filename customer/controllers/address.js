/* eslint-disable no-underscore-dangle */
/* eslint-disable eqeqeq */
const { validationResult } = require('express-validator');
const { Types } = require('mongoose');
const { Address, Customer } = require('../model');
const errors = require('../util/errors');

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

  try {
    const createdRes = await Address.create({ ...address, customerId: user });

    await Customer.update({ _id: Types.ObjectId(user) }, { $push: { addresses: createdRes._id } });

    res.status(201).json(createdRes);
    return;
  } catch (err) {
    console.error(err);
    res.status(500).json(errors.serverError);
  }
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

  try {
    const dbRes = await Address.findOneAndUpdate(
      { _id: id, customerId: user },
      { ...address, customerId: Types.ObjectId(user) },
      { returnOriginal: false },
    );
    if (!dbRes) {
      res.status(404).json(errors.notFound);
      return;
    }

    res.status(200).json(dbRes);
    return;
  } catch (err) {
    console.error(err);
    res.status(500).json(errors.serverError);
  }
};

const deleteAddress = async (req, res) => {
  const id = req.params.addID;
  if (!id || id == 0) {
    res.status(400).json(errors.badRequest);
    return;
  }

  try {
    const { user } = req.headers;
    const address = await Address.findOneAndDelete({ _id: id, customerId: Types.ObjectId(user) });
    if (!address) {
      res.status(404).json(errors.notFound);
      return;
    }

    await Customer.update({ _id: Types.ObjectId(user) }, { $pull: { addresses: address._id } });

    res.status(200).send(null);
    return;
  } catch (err) {
    console.error(err);
    res.status(500).json(errors.serverError);
  }
};

module.exports = {
  getAllAddresses,
  getAddressByID,
  createAddress,
  updateAddress,
  deleteAddress,
  getAllAddressesForRestaurant,
};
