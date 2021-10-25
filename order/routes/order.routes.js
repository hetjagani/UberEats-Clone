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

/**
 * @typedef PlaceOrder
 * @property {string} orderId.required
 * @property {string} addressId.required
 * @property {string} notes
 */

/**
 * @typedef UpdateOrder
 * @property {string} status.required
 */

const bodyValidators = () => [
  body('status')
    .exists()
    .isString()
    .isIn(['PLACED', 'PREPARING', 'COMPLETE', 'PICKUP_READY', 'CANCEL']),
];
const placeOrderValidators = () => [
  body('orderId').exists().isString(),
  body('addressId').exists().isString(),
  body('notes').optional({ nullable: true }).isString(),
];

/**
 * Get list of Orders
 * @route GET /orders
 * @group Orders
 * @param {string} status.query
 * @param {string} page.query
 * @param {string} limit.query
 * @security JWT
 * @returns {Array.<Order>} 200 - List of orders info
 */
router.get('/', orderController.getAllOrders);

/**
 * Get all restaurant's of Orders
 * @route GET /orders/all
 * @group Orders
 * @security JWT
 * @returns {Array.<Order>} 200 - List of orders info
 */
router.get('/all', orderController.getAllRestaurantsOrder);

/**
 * Place Order
 * @route POST /orders/place
 * @group Orders
 * @security JWT
 * @param {PlaceOrder.model} PlaceOrder.body.require
 * @returns {Order.model} 201 - Created Order
 */
router.post('/place', ...placeOrderValidators(), orderController.placeOrder);

/**
 * Create Order
 * @route POST /orders/{type}
 * @group Orders
 * @security JWT
 * @param {string} type.path.require
 * @returns {Order.model} 201 - Created Order
 */
router.post('/:type', orderController.createOrder);

/**
 * Get Order by ID
 * @route GET /orders/{id}
 * @group Orders
 * @security JWT
 * @param {string} id.path.require
 * @returns {Order.model} 200 - Order for given ID
 */
router.get('/:id', orderController.getOrderById);

/**
 * Update Order Status
 * @route PUT /orders/{id}
 * @group Orders
 * @security JWT
 * @param {string} id.path.require
 * @param {UpdateOrder.model} UpdateOrder.body.require
 * @returns {Order.model} 200 - Updated Order
 */
router.put('/:id', ...bodyValidators(), orderController.updateOrderStatus);

module.exports = router;
