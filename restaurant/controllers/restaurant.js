const { validationResult } = require("express-validator");
const { Restaurant } = require("../model");
const errors = require("../util/errors");

const getAllRestaurants = async (req, res) => {
    const restaurants = await Restaurant.findAll();

    res.status(200).json(restaurants);
};

const getRestaurantByID = async (req, res) => {
    const id = req.params.id;
    if (!id) {
        res.status(400).json(errors.badRequest);
        return;
    }

    const restaurant = await Restaurant.findOne({ where: { id: id } });
    if (!restaurant) {
        res.status(401).send(errors.notFound);
        return;
    }

    res.status(200).json(restaurant);
};

// TODO: check if the logged in user ID == req.body.id
const createRestaurant = async (req, res) => {
    const err = validationResult(req);
    if (!err.isEmpty()) {
        console.error(err);
        res.status(400).json({status:400, message: err.array()});
        return;
    }

    const restaurant = req.body;

    try {
        const createdRes = await Restaurant.create(restaurant);
        res.status(201).json(createdRes);
        return;
    } catch (err) {
        console.error(err);
        if(err.original) {
            res.status(500).json({status: 500, message: err.original.sqlMessage})
        }else {
            res.status(500).json(errors.serverError);
        }
    }
};

const updateRestaurantByID = async (req, res) => {
    const id = req.params.id;
    if (!id) {
        res.status(400).json(errors.badRequest);
        return;
    }

    const err = validationResult(req);
    if (!err.isEmpty()) {
        console.error(err);
        res.status(400).json({status:400, message: err.array()});
        return;
    }

    const restaurant = req.body;

    const dbRes = await Restaurant.findOne({where: {id: id}});
    if(!restaurant) {
        res.status(404).json(errors.notFound);
        return;
    }

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

        const updatedRes = await dbRes.save();

        res.status(200).json(updatedRes);
        return;
    } catch(err) {
        console.error(err);
        if(err.original) {
            res.status(500).json({status: 500, message: err.original.sqlMessage})
        }else {
            res.status(500).json(errors.serverError);
        }
    }

};

const deleteRestaurant = async (req, res) => {
    const id = req.params.id;
    if (!id) {
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
        return
    } catch(err) {
        console.error(err);
        if(err.original) {
            res.status(500).json({status: 500, message: err.original.sqlMessage})
        }else {
            res.status(500).json(errors.serverError);
        }
    }

};

module.exports = {
    getAllRestaurants,
    getRestaurantByID,
    createRestaurant,
    updateRestaurantByID,
    deleteRestaurant,
};
