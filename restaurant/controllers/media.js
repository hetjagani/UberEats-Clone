/* eslint-disable eqeqeq */
const { validationResult } = require('express-validator');
const { Media } = require('../model');
const errors = require('../util/errors');
const getPaiganation = require('../util/paiganation');

const getAllMedia = async (req, res) => {
  const { limit, offset } = getPaiganation(req.query.page, req.query.limit);

  const mediaCount = await Media.count();
  const media = await Media.findAll({ limit, offset });

  res.status(200).json({ total: mediaCount, nodes: media });
};

const getMediaByID = async (req, res) => {
  const { id } = req.params;
  if (!id || id == 0) {
    res.status(400).json(errors.badRequest);
    return;
  }

  const media = await Media.findOne({ where: { id } });
  if (!media) {
    res.status(401).send(errors.notFound);
    return;
  }

  res.status(200).json(media);
};

const createMedia = async (req, res) => {
  const valErr = validationResult(req);
  if (!valErr.isEmpty()) {
    console.error(valErr);
    res.status(400).json({ status: 400, message: valErr.array() });
    return;
  }

  const media = req.body;

  try {
    const createdRes = await Media.create(media);
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

const updateMediaByID = async (req, res) => {
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

  const media = req.body;

  const dbRes = await Media.findOne({ where: { id } });
  if (!dbRes) {
    res.status(404).json(errors.notFound);
    return;
  }

  try {
    dbRes.url = media.url;
    dbRes.alt_text = media.alt_text;

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

const deleteMediaByID = async (req, res) => {
  const { id } = req.params;
  if (!id || id == 0) {
    res.status(400).json(errors.badRequest);
    return;
  }

  const media = await Media.findOne({ where: { id } });
  if (!media) {
    res.status(401).send(errors.notFound);
    return;
  }

  try {
    await media.destroy();
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
  getAllMedia,
  getMediaByID,
  createMedia,
  updateMediaByID,
  deleteMediaByID,
};
