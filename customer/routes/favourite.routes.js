const express = require("express");
const { body } = require("express-validator");
const favouriteController = require("../controllers/favourite");

const router = express.Router();

/**
 * @typedef Favourite
 * @property {integer} restaurantId.required
 */

const bodyValidators = () => {
    return [body("restaurantId").exists().isNumeric()];
};

/**
 * Get list of Favourites for Customer
 * @route GET /customers/favourites
 * @group Favourites
 * @param {string} authorization.header.require
 * @param {integer} page.query.require
 * @param {integer} limit.query.require
 * @returns {Array.<Dish>} 200 - List of dishes info
 */
router.get("/", favouriteController.getCustomerFavourites);

/**
 * Create Favourite for Customer
 * @route POST /customers/favourites
 * @group Favourites
 * @param {string} authorization.header.require
 * @param {Favourite.model} Favourite.body.require
 * @returns {Favourite.model} 201 - Created Favourite
 */
router.post("/", ...bodyValidators(), favouriteController.createCustomerFavourite);

/**
 * Get Favourite by ID
 * @route GET /customers/favourites/{favID}
 * @group Favourites
 * @param {string} authorization.header.require
 * @param {integer} favID.path.require
 * @returns {Favourite.model} 200 - Favourite for given ID
 */
router.get("/:favID", favouriteController.getCustomerFavouriteByID);

/**
 * Delete Favourite by ID
 * @route DELETE /customers/favourites/{favID}
 * @group Favourites
 * @param {string} authorization.header.require
 * @param {integer} favID.path.require
 * @returns {null} 200 - Delete Favourite
 */
router.delete("/:favID", favouriteController.deleteCustomerFavourite);

module.exports = router;
