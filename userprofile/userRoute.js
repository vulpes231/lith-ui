const express = require("express");
const {
  updateUser,
  getUser,
  updatePassword,
  logoutUser,
} = require("./userHandler");

const router = express.Router();
router.route("/").get(getUser).put(updateUser);
router.route("/changepass").post(updatePassword);
router.route("/logout").post(logoutUser);

module.exports = router;
