const express = require("express");
const {
  verifyEmail,
  sendEmailCode,
  sendLoginCode,
} = require("./verifyHandler");

const router = express.Router();

router.route("/loginotp").post(sendLoginCode);
router.route("/emailotp").post(sendEmailCode);
router.route("/verifymail").post(verifyEmail);

module.exports = router;
