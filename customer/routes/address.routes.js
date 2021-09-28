const express = require('express');
const { body } = require('express-validator');
const addressController = require('../controllers/address');

const router = express.Router();

/**
 * @typedef Address
 * @property {string} firstLine.required
 * @property {string} secondLine.required
 * @property {integer} zipcode.required
 * @property {string} city.required
 * @property {string} state.required
 * @property {string} country.required
 * @property {integer} customerId.required
 */

const bodyValidators = () => [
  body('firstLine').exists().isString(),
  body('secondLine').isString(),
  body('zipcode').isInt(),
  body('city').exists().isString(),
  body('state').exists().isString(),
  body('country').exists().isString(),
];

/**
 * Get list of Addresses
 * @route GET /customers/addresses
 * @group Addresses
 * @param {string} authorization.header.require
 * @param {integer} page.query.require
 * @param {integer} limit.query.require
 * @returns {Array.<Address>} 200 - List of address info
 */
router.get('/', addressController.getAllAddresses);

/**
 * Create Address
 * @route POST /customers/addresses
 * @group Addresses
 * @param {string} authorization.header.require
 * @param {Address.model} Address.body.require
 * @returns {Address.model} 201 - Created Address
 */
router.post('/', ...bodyValidators(), addressController.createAddress);

/**
 * Get Address by ID
 * @route GET /customers/addresses/{addID}
 * @group Addresses
 * @param {string} authorization.header.require
 * @param {integer} addID.path.require
 * @returns {Media.model} 200 - Media for given ID
 */
router.get('/:addID', addressController.getAddressByID);

/**
 * Update Address by ID
 * @route PUT /customers/addresses/{addID}
 * @group Addresses
 * @param {string} authorization.header.require
 * @param {integer} addID.path.require
 * @param {Address.model} Address.body.require
 * @returns {Address.model} 200 - Updated Address
 */
router.put('/:addID', ...bodyValidators(), addressController.updateAddress);

/**
 * Delete Address by ID
 * @route DELETE /customers/addresses/{addID}
 * @group Addresses
 * @param {string} authorization.header.require
 * @param {integer} addID.path.require
 * @returns {null} 200 - Delete Media
 */
router.delete('/:addID', addressController.deleteAddress);

module.exports = router;
