/* eslint-disable newline-per-chained-call */
const express = require('express');
const { body } = require('express-validator');
const cartItemController = require('../controllers/cartitem');

const router = express.Router();

/**
 * @typedef CartItem
 * @property {integer} dishId.required
 * @property {integer} restaurantId.required
 * @property {integer} quantity.required
 * @property {string} notes
 */

const bodyValidators = () => [
  body('dishId').exists().isInt().not().isIn([0]),
  body('restaurantId').exists().isInt().not().isIn([0]),
  body('quantity').exists().isInt().not().isIn([0]),
  body('notes').isString(),
];

/**
 * Get list of CartItems
 * @route GET /cartitems
 * @group CartItems
 * @param {string} authorization.header.require
 * @returns {Array.<CartItem>} 200 - List of cart items info
 */
router.get('/', cartItemController.getAllCartItems);

/**
 * Add Item to Cart
 * @route POST /cartitems
 * @group CartItems
 * @param {string} authorization.header.require
 * @param {CartItem.model} CartItem.body.require
 * @returns {CartItem.model} 201 - Created Cart Item
 */
router.post('/', ...bodyValidators(), cartItemController.addCartItem);

/**
 * Reset Cart
 * @route DELETE /cartitems/reset
 * @group CartItems
 * @param {string} authorization.header.require
 */
router.delete('/reset', ...bodyValidators(), cartItemController.resetCartItems);

/**
 * Delete CartItem
 * @route DELETE /cartitems/{id}
 * @group CartItems
 * @param {string} authorization.header.require
 * @param {integer} id.path.require
 * @returns {null} 200 - Delete CartItem
 */
router.delete('/:id', cartItemController.deleteCartItem);

module.exports = router;
