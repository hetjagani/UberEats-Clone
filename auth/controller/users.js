const express = require("express");
const { User } = require("../model");
const router = express.Router();

/**
 * Get all users
 * @route GET /users
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 */
router.get("/", async (req, res) => {
    const users = await User.findAll();

    res.json(users);
});

module.exports = router;
