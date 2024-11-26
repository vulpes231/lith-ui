const express = require("express");
const { signupUser } = require("./registerHandler");

const router = express.Router();
router.route("/").post(signupUser);

module.exports = router;
