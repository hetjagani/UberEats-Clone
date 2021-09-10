const { validationResult } = require("express-validator");
const { Dish, Restaurant } = require("../model");
const errors = require("../util/errors");

const getDishesForRestaurant = async (req, res) => {
    const resID = req.params.resID;
    if (!resID || resID === 0) {
        res.status(400).json(errors.badRequest);
        return;
    }

    const dishes = await Dish.findAll({ where: { restaurantId: resID } });

    res.status(200).json(dishes);
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

    const dish = await Dish.findOne({ where: { id: dishID, restaurantId: resID } });
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

    try {
        dish.restaurantId = resID;
        const createdRes = await Dish.create(dish);
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

    try {
        dbRes.name = dish.name;
        dbRes.description = dish.description;
        dbRes.price = dish.price;
        dbRes.food_type = dish.food_type;
        dbRes.category = dish.category;

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
