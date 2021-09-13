/* eslint-disable newline-per-chained-call */
const express = require('express');
const { body } = require('express-validator');
const orderController = require('../controllers/order');

const router = express.Router();

/**
 * @typedef Order
 * @property {float} amount.required
 * @property {string} status.required
 * @property {string} date.required
 * @property {integer} restaurantId.required
 * @property {integer} customerId.required
 * @property {integer} addressId.required
 * @property {string} type.required
 */

const bodyValidators = () => [body('status').exists().isString()];

/**
 * Get list of Orders
 * @route GET /orders
 * @group Orders
 * @param {string} authorization.header.require
 * @returns {Array.<Order>} 200 - List of orders info
 */
router.get('/', orderController.getAllOrders);

/**
 * Create Order
 * @route POST /orders/{type}
 * @group Orders
 * @param {string} authorization.header.require
 * @param {string} type.path.require
 * @returns {Order.model} 201 - Created Order
 */
router.post('/:type', orderController.createOrder);

/**
 * Get Restaurant by ID
 * @route GET /orders/{id}
 * @group Orders
 * @param {string} authorization.header.require
 * @param {integer} id.path.require
 * @returns {Order.model} 200 - Order for given ID
 */
router.get('/:id', orderController.getOrderById);

/**
 * Update Order Status
 * @route PUT /orders/{id}
 * @group Orders
 * @param {string} authorization.header.require
 * @param {integer} id.path.require
 * @returns {Order.model} 200 - Updated Order
 */
router.put('/:id', ...bodyValidators(), orderController.updateOrderStatus);

/**
 * Delete Order by ID
 * @route DELETE /orders/{id}
 * @group Orders
 * @param {string} authorization.header.require
 * @param {integer} id.path.require
 * @returns {null} 200 - Delete Order
 */
router.delete('/:id', orderController.deleteOrder);

module.exports = router;
