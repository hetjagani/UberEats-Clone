const express = require("express");
const { body } = require("express-validator");
const mediaController = require("../controllers/media");

const router = express.Router();

/**
 * @typedef Media
 * @property {string} url.required
 * @property {string} alt_text.required
 */

const bodyValidators = () => {
    return [body("url").exists().isString().isURL(), body("alt_text").isString()];
};

/**
 * Get list of Media
 * @route GET /media
 * @group Media
 * @param {string} authorization.header.require
 * @param {integer} page.query.require
 * @param {integer} limit.query.require
 * @returns {Array.<Media>} 200 - List of media info
 */
router.get("/", mediaController.getAllMedia);

/**
 * Create Media
 * @route POST /media
 * @group Media
 * @param {string} authorization.header.require
 * @param {Media.model} Media.body.require
 * @returns {Media.model} 201 - Created Media
 */
router.post("/", ...bodyValidators(), mediaController.createMedia);

/**
 * Get Media by ID
 * @route GET /media/{id}
 * @group Media
 * @param {string} authorization.header.require
 * @param {integer} id.path.require
 * @returns {Media.model} 200 - Media for given ID
 */
router.get("/:id", mediaController.getMediaByID);

/**
 * Update Media by ID
 * @route PUT /media/{id}
 * @group Media
 * @param {string} authorization.header.require
 * @param {integer} id.path.require
 * @param {Media.model} Media.body.require
 * @returns {Media.model} 200 - Updated Media
 */
router.put("/:id", ...bodyValidators(), mediaController.updateMediaByID);

/**
 * Delete Media by ID
 * @route DELETE /media/{id}
 * @group Media
 * @param {string} authorization.header.require
 * @param {integer} id.path.require
 * @returns {null} 200 - Delete Media
 */
router.delete("/:id", mediaController.deleteMediaByID);

module.exports = router;
