const express = require("express");
const { body } = require("express-validator");
const dishController = require("../controllers/dish");

const router = express.Router({mergeParams: true});

/**
 * @typedef Dish
 * @property {string} name.required
 * @property {string} description.required
 * @property {float} price.required
 * @property {string} food_type.required
 * @property {string} category.required
 * @property {Array<integer>} media.required
 */

const bodyValidators = () => {
    return [
        body("name").exists().isString(),
        body("description").isString(),
        body("price").exists().isFloat(),
        body("food_type").exists().matches("veg|non-veg|vegan").isString(),
        body("category").exists().matches("appetizer|salad|main_course|dessert|beverage").isString(),
        body("media").isArray(),
    ];
};

/**
 * Get list of Dishes for restaurant
 * @route GET /restaurants/{resID}/dishes
 * @group Dishes
 * @param {string} authorization.header.require
 * @param {integer} resID.path.require
 * @param {integer} page.query.require
 * @param {integer} limit.query.require
 * @returns {Array.<Dish>} 200 - List of dishes info
 */
router.get("/", dishController.getDishesForRestaurant);

/**
 * Create Dish in a restaurant
 * @route POST /restaurants/{resID}/dishes
 * @group Dishes
 * @param {string} authorization.header.require
 * @param {integer} resID.path.require
 * @param {Dish.model} Dish.body.require
 * @returns {Dish.model} 201 - Created Dish
 */
router.post("/", ...bodyValidators(), dishController.createDishForRestaurant);

/**
 * Get Dish by ID
 * @route GET /restaurants/{resID}/dishes/{dishID}
 * @group Dishes
 * @param {string} authorization.header.require
 * @param {integer} resID.path.require
 * @param {integer} dishID.path.require
 * @returns {Dish.model} 200 - Dish for given ID
 */
router.get("/:dishID", dishController.getDishForRestaurantByID);

/**
 * Update Dish by ID
 * @route PUT /restaurants/{resID}/dishes/{dishID}
 * @group Dishes
 * @param {string} authorization.header.require
 * @param {integer} resID.path.require
 * @param {integer} dishID.path.require
 * @param {Dish.model} Dish.body.require
 * @returns {Dish.model} 200 - Updated Dish
 */
router.put("/:dishID", ...bodyValidators(), dishController.updateDishInRestaurant);

/**
 * Delete Dish by ID
 * @route DELETE /restaurants/{resID}/dishes/{dishID}
 * @group Dishes
 * @param {string} authorization.header.require
 * @param {integer} resID.path.require
 * @param {integer} dishID.path.require
 * @returns {null} 200 - Delete Dish
 */
router.delete("/:dishID", dishController.deleteDishInRestaurant);

module.exports = router;
