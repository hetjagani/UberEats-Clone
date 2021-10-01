/* eslint-disable eqeqeq */
const { validationResult } = require('express-validator');
const { Address, Customer } = require('../model');
const errors = require('../util/errors');

// NOTE: not done paiganation for addresses
const getAllAddresses = async (req, res) => {
  const { user } = req.headers;
  const customer = await Customer.findOne({ where: { id: user }, include: Address });

  res.status(200).json(customer.addresses);
};

// admin endpoint
const getAllAddressesForRestaurant = async (req, res) => {
  const addresses = await Address.findAll();

  res.status(200).json(addresses);
};

const getAddressByID = async (req, res) => {
  const id = req.params.addID;
  if (!id || id == 0) {
    res.status(400).json(errors.badRequest);
    return;
  }

  const { user } = req.headers;

  const address = await Address.findOne({ where: { customerId: user, id } });
  if (!address) {
    res.status(404).json(errors.notFound);
    return;
  }

  res.status(200).json(address);
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

  const dbRes = await Address.findOne({ where: { id, customerId: user } });
  if (!dbRes) {
    res.status(404).json(errors.notFound);
    return;
  }

  try {
    dbRes.firstLine = address.firstLine;
    dbRes.secondLine = address.secondLine;
    dbRes.zipcode = address.zipcode;
    dbRes.city = address.city;
    dbRes.state = address.state;
    dbRes.country = address.country;

    const updatedRes = await dbRes.save();

    res.status(200).json(updatedRes);
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

const deleteAddress = async (req, res) => {
  const id = req.params.addID;
  if (!id || id == 0) {
    res.status(400).json(errors.badRequest);
    return;
  }

  const { user } = req.headers;
  const address = await Address.findOne({ where: { id, customerId: user } });
  if (!address) {
    res.status(404).json(errors.notFound);
    return;
  }

  try {
    await address.destroy();
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
  getAllAddresses,
  getAddressByID,
  createAddress,
  updateAddress,
  deleteAddress,
  getAllAddressesForRestaurant,
};
