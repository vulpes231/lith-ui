const express = require("express");
const { signinUser } = require("./loginHandler");

const router = express.Router();
router.route("/").post(signinUser);

module.exports = router;
