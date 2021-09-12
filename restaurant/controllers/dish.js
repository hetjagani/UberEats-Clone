const { validationResult } = require("express-validator");
const { Dish, Restaurant, Media } = require("../model");
const errors = require("../util/errors");
const getPaiganation = require("../util/paiganation");

const getDishesForRestaurant = async (req, res) => {
    const resID = req.params.resID;
    if (!resID || resID === 0) {
        res.status(400).json(errors.badRequest);
        return;
    }

    const { limit, offset } = getPaiganation(req.query.page, req.query.limit);

    const dishCount = await Dish.count({ where: { restaurantId: resID } });
    const dishes = await Dish.findAll({ where: { restaurantId: resID }, limit: limit, offset: offset, include: Media });

    res.status(200).json({ total: dishCount, nodes: dishes });
};

const getDishForRestaurantByID = async (req, res) => {
    const resID = req.params.resID;
    if (!resID || resID === 0) {
        res.status(400).json(errors.badRequest);
        return;
    }

    const dishID = req.params.dishID;
    if (!dishID || dishID === 0) {
        res.status(400).json(errors.badRequest);
        return;
    }

    const dish = await Dish.findOne({ where: { id: dishID, restaurantId: resID }, include: Media });
    if (!dish) {
        res.status(404).json(errors.notFound);
        return;
    }

    res.status(200).json(dish);
};

const createDishForRestaurant = async (req, res) => {
    const resID = req.params.resID;
    if (!resID || resID === 0) {
        res.status(400).json(errors.badRequest);
        return;
    }

    const err = validationResult(req);
    if (!err.isEmpty()) {
        console.error(err);
        res.status(400).json({ status: 400, message: err.array() });
        return;
    }

    const restaurant = await Restaurant.findOne({ where: { id: resID } });
    if (!restaurant) {
        res.status(404).json({ ...errors.notFound, message: "restaurant not found" });
        return;
    }

    const dish = req.body;

    const t = await global.DB.transaction();
    try {
        dish.restaurantId = resID;
        const createdRes = await Dish.create(dish, { transaction: t });

        if (dish.media && dish.media.length > 0) {
            await createdRes.setMedia(dish.media, { transaction: t });
        }
        await t.commit();

        const result = await Dish.findOne({ where: { id: createdRes.id }, include: Media }, { transaction: t });

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

const updateDishInRestaurant = async (req, res) => {
    const resID = req.params.resID;
    if (!resID || resID === 0) {
        res.status(400).json(errors.badRequest);
        return;
    }

    const dishID = req.params.dishID;
    if (!dishID || dishID === 0) {
        res.status(400).json(errors.badRequest);
        return;
    }

    const err = validationResult(req);
    if (!err.isEmpty()) {
        console.error(err);
        res.status(400).json({ status: 400, message: err.array() });
        return;
    }

    const dbRes = await Dish.findOne({ where: { id: dishID, restaurantId: resID } });
    if (!dbRes) {
        res.status(404).json({ ...errors.notFound, message: "dish not found for restaurant" });
        return;
    }

    const dish = req.body;

    const t = await global.DB.transaction();
    try {
        dbRes.name = dish.name;
        dbRes.description = dish.description;
        dbRes.price = dish.price;
        dbRes.food_type = dish.food_type;
        dbRes.category = dish.category;

        const updatedRes = await dbRes.save({ transaction: t });

        if (dish.media && dish.media.length > 0) {
            await updatedRes.setMedia(dish.media, { transaction: t });
        }

        await t.commit();

        const result = await Dish.findOne({ where: { id: updatedRes.id }, include: Media }, { transaction: t });
        res.status(200).json(result);
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

const deleteDishInRestaurant = async (req, res) => {
    const resID = req.params.resID;
    if (!resID || resID === 0) {
        res.status(400).json(errors.badRequest);
        return;
    }

    const dishID = req.params.dishID;
    if (!dishID || dishID === 0) {
        res.status(400).json(errors.badRequest);
        return;
    }

    const dish = await Dish.findOne({ where: { id: dishID, restaurantId: resID } });
    if (!dish) {
        res.status(404).json({ ...errors.notFound, message: "dish not found for restaurant" });
        return;
    }

    try {
        await dish.destroy();
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
    getDishesForRestaurant,
    getDishForRestaurantByID,
    createDishForRestaurant,
    updateDishInRestaurant,
    deleteDishInRestaurant,
};
