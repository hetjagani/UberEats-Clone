/* eslint-disable newline-per-chained-call */
const express = require('express');
const { body } = require('express-validator');
const resController = require('../controllers/restaurant');
const dishRouter = require('./dish.routes');

const router = express.Router();

/**
 * @typedef Restaurant
 * @property {string} id.required
 * @property {string} name.required
 * @property {string} description
 * @property {string} address.required
 * @property {string} city.required
 * @property {string} state.required
 * @property {string} country.required
 * @property {string} contact_no.required
 * @property {string} time_open.required
 * @property {string} time_close.required
 * @property {string} food_type.required
 * @property {string} restaurant_type.required
 * @property {Array<integer>} media.required
 */

const bodyValidators = () => [
  body('id').exists().isString(),
  body('name').exists().isString(),
  body('description').isString(),
  body('address').exists().isString(),
  body('city').exists().isString(),
  body('state').exists().isString(),
  body('country').exists().isString(),
  body('contact_no').exists().isString(),
  body('time_open').exists().matches('..:..'),
  body('time_close').exists().matches('..:..'),
  body('food_type').exists().matches('veg|non-veg|vegan').isString(),
  body('restaurant_type').exists().matches('delivery|pickup').isString(),
  body('media').optional({ nullable: true }).isArray(),
];

const [, ...updateValidators] = bodyValidators();

router.use('/:resID/dishes', dishRouter);

/**
 * Get list of Restaurants
 * @route GET /restaurants/all
 * @group Restaurants
 * @security JWT
 * @returns {Array.<Restaurant>} 200 - List of restaurant info
 */
router.get('/all', resController.allRestaurants);

/**
 * Get list of Restaurants
 * @route GET /restaurants
 * @group Restaurants
 * @security JWT
 * @param {integer} page.query.require
 * @param {integer} limit.query.require
 * @param {string} address.query.require
 * @param {string} city.query.require
 * @param {string} restaurant_type.query.require
 * @param {string} food_type.query.require
 * @param {string} q.query.require
 * @returns {Array.<Restaurant>} 200 - List of restaurant info
 */
router.get('/', resController.getAllRestaurants);

/**
 * Create a Restaurant
 * @route POST /restaurants
 * @group Restaurants
 * @security JWT
 * @param {Restaurant.model} Restaurant.body.require
 * @returns {Restaurant.model} 201 - Created Restaurant
 */
router.post('/', ...bodyValidators(), resController.createRestaurant);

/**
 * Get Restaurant by ID
 * @route GET /restaurants/{id}
 * @group Restaurants
 * @security JWT
 * @param {string} id.path.require
 * @returns {Restaurant.model} 200 - Restaurant for given ID
 */
router.get('/:id', resController.getRestaurantByID);

/**
 * Update Restaurant by ID
 * @route PUT /restaurants/{id}
 * @group Restaurants
 * @security JWT
 * @param {string} id.path.require
 * @param {Restaurant.model} Restaurant.body.require
 * @returns {Restaurant.model} 200 - Updated Restaurant
 */
router.put('/:id', ...updateValidators, resController.updateRestaurantByID);

/**
 * Delete Restaurant by ID
 * @route DELETE /restaurants/{id}
 * @group Restaurants
 * @security JWT
 * @param {string} id.path.require
 * @returns {null} 200 - Delete Restaurant
 */
router.delete('/:id', resController.deleteRestaurant);

module.exports = router;
