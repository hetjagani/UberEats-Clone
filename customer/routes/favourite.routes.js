const express = require('express');
const { body } = require('express-validator');
const favouriteController = require('../controllers/favourite');

const router = express.Router();

/**
 * @typedef Favourite
 * @property {integer} restaurantId.required
 */

const bodyValidators = () => [body('restaurantId').exists().isString()];

/**
 * Get list of Favourites for Customer
 * @route GET /customers/favourites
 * @group Favourites
 * @security JWT
 * @param {integer} page.query.require
 * @param {integer} limit.query.require
 * @returns {Array.<Favourite>} 200 - List of dishes info
 */
router.get('/', favouriteController.getCustomerFavourites);

/**
 * Create Favourite for Customer
 * @route POST /customers/favourites
 * @group Favourites
 * @security JWT
 * @param {Favourite.model} Favourite.body.require
 * @returns {Favourite.model} 201 - Created Favourite
 */
router.post('/', ...bodyValidators(), favouriteController.createCustomerFavourite);

/**
 * Delete Favourite by ID
 * @route DELETE /customers/favourites/{favID}
 * @group Favourites
 * @security JWT
 * @param {string} favID.path.require
 * @returns {null} 200 - Delete Favourite
 */
router.delete('/:favID', favouriteController.deleteCustomerFavourite);

module.exports = router;
