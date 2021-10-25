/* eslint-disable newline-per-chained-call */
const express = require('express');
const { body } = require('express-validator');
const cartItemController = require('../controllers/cartitem');

const router = express.Router();

/**
 * @typedef CartItem
 * @property {string} dishId.required
 * @property {string} restaurantId.required
 * @property {integer} quantity.required
 * @property {string} notes
 */

const bodyValidators = () => [
  body('dishId').exists().isString().not().isIn(['']),
  body('restaurantId').exists().isString().not().isIn(['']),
  body('quantity').exists().isInt().not().isIn([0]),
  body('notes').isString(),
];

const updateValidators = () => [
  body('quantity').exists().isInt().not().isIn([0]),
  body('notes').isString(),
];

/**
 * Get list of CartItems
 * @route GET /cartitems
 * @group CartItems
 * @security JWT
 * @returns {Array.<CartItem>} 200 - List of cart items info
 */
router.get('/', cartItemController.getAllCartItems);

/**
 * Add Item to Cart
 * @route POST /cartitems
 * @group CartItems
 * @security JWT
 * @param {CartItem.model} CartItem.body.require
 * @returns {CartItem.model} 201 - Created Cart Item
 */
router.post('/', ...bodyValidators(), cartItemController.addCartItem);

/**
 * Update Item in Cart
 * @route PUT /cartitems/{id}
 * @group CartItems
 * @security JWT
 * @param {string} id.path.require
 * @param {CartItem.model} CartItem.body.require
 * @returns {CartItem.model} 200 - Updated Cart Item
 */
router.put('/:id', ...updateValidators(), cartItemController.updateCartItem);

/**
 * Reset Cart
 * @route DELETE /cartitems/reset
 * @group CartItems
 * @security JWT
 */
router.delete('/reset', ...bodyValidators(), cartItemController.resetCartItems);

/**
 * Delete CartItem
 * @route DELETE /cartitems/{id}
 * @group CartItems
 * @security JWT
 * @param {string} id.path.require
 * @returns {null} 200 - Delete CartItem
 */
router.delete('/:id', cartItemController.deleteCartItem);

module.exports = router;
