const { validationResult } = require("express-validator");
const { Restaurant, Media, Dish } = require("../model");
const errors = require("../util/errors");
const getPaiganation = require("../util/paiganation");

const allRestaurants = async (req, res) => {
    const restaurants = await Restaurant.findAll({ include: [Media, Dish] });

    res.status(200).json(restaurants);
};

const getAllRestaurants = async (req, res) => {
    const { limit, offset } = getPaiganation(req.query.page, req.query.limit);

    const resCount = await Restaurant.count();
    const restaurants = await Restaurant.findAll({ limit: limit, offset: offset, include: [Media, Dish] });

    res.status(200).json({ total: resCount, nodes: restaurants });
};

const getRestaurantByID = async (req, res) => {
    const id = req.params.id;
    if (!id || id == 0) {
        res.status(400).json(errors.badRequest);
        return;
    }

    const restaurant = await Restaurant.findOne({ where: { id: id }, include: [Media, Dish] });
    if (!restaurant) {
        res.status(404).send(errors.notFound);
        return;
    }

    res.status(200).json(restaurant);
};

const createRestaurant = async (req, res) => {
    const user = req.headers.user;
    if (user !== req.body.id) {
        res.status(400).json({
            ...errors.badRequest,
            message: "restaurant.id in body should be same as logged in user",
        });
        return;
    }

    const err = validationResult(req);
    if (!err.isEmpty()) {
        console.error(err);
        res.status(400).json({ status: 400, message: err.array() });
        return;
    }

    const restaurant = req.body;

    const t = await global.DB.transaction();
    try {
        const createdRes = await Restaurant.create(restaurant, { transaction: t });

        if (restaurant.media && restaurant.media.length > 0) {
            await createdRes.setMedia(restaurant.media, { transaction: t });
        }
        await t.commit();

        const result = await Restaurant.findOne({ where: { id: createdRes.id }, include: Media }, { transaction: t });

        res.status(201).json(result);
        return;
    } catch (err) {
        await t.rollback();
        console.error(err);
        if (err.original) {
            res.status(500).json({ status: 500, message: err.original.sqlMessage });
        } else {
            res.status(500).json(errors.serverError);
        }
    }
};

const updateRestaurantByID = async (req, res) => {
    const user = req.headers.user;
    if (user !== req.body.id) {
        res.status(400).json({
            ...errors.badRequest,
            message: "restaurant.id in body should be same as logged in user",
        });
        return;
    }
    const id = req.params.id;
    if (!id || id == 0) {
        res.status(400).json(errors.badRequest);
        return;
    }

    const err = validationResult(req);
    if (!err.isEmpty()) {
        console.error(err);
        res.status(400).json({ status: 400, message: err.array() });
        return;
    }

    const restaurant = req.body;

    const dbRes = await Restaurant.findOne({ where: { id: id } });
    if (!dbRes) {
        res.status(404).json(errors.notFound);
        return;
    }

    const t = await global.DB.transaction();
    try {
        dbRes.name = restaurant.name;
        dbRes.description = restaurant.description;
        dbRes.address = restaurant.address;
        dbRes.city = restaurant.city;
        dbRes.state = restaurant.state;
        dbRes.country = restaurant.country;
        dbRes.contact_no = restaurant.contact_no;
        dbRes.time_open = restaurant.time_open;
        dbRes.time_close = restaurant.time_close;
        dbRes.food_type = restaurant.food_type;
        dbRes.restaurant_type = restaurant.restaurant_type;

        const updatedRes = await dbRes.save({ transaction: t });

        if (restaurant.media && restaurant.media.length > 0) {
            await updatedRes.setMedia(restaurant.media, { transaction: t });
        }

        await t.commit();

        const result = await Restaurant.findOne({ where: { id: updatedRes.id }, include: Media }, { transaction: t });

        res.status(200).json(result);
        return;
    } catch (err) {
        t.rollback();
        console.error(err);
        if (err.original) {
            res.status(500).json({ status: 500, message: err.original.sqlMessage });
        } else {
            res.status(500).json(errors.serverError);
        }
    }
};

const deleteRestaurant = async (req, res) => {
    const id = req.params.id;
    if (!id || id == 0) {
        res.status(400).json(errors.badRequest);
        return;
    }

    const restaurant = await Restaurant.findOne({ where: { id: id } });
    if (!restaurant) {
        res.status(401).send(errors.notFound);
        return;
    }

    try {
        await restaurant.destroy();
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
    allRestaurants,
    getAllRestaurants,
    getRestaurantByID,
    createRestaurant,
    updateRestaurantByID,
    deleteRestaurant,
};
