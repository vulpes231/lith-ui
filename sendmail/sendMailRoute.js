const { sendEmail } = require("./sendMailHandler");

const express = require("express");

const router = express.Router();

router.route("/").post(sendEmail);

module.exports = router;
