const express = require("express");
const router = express.Router();


// Get today's attendace
/**
 * This function comment is parsed by doctrine
 * @route GET /hello/test
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 */
router.get("/test", (req, res) => {
    res.json({hello: "world"});
})

module.exports = router;
