const express = require("express");
const router = express.Router();

const {
  getUserAlerts,
  createAlert,
  updateAlert,
  getAlert,
} = require("./alertHandler");

router.route("/").get(getUserAlerts).post(createAlert);
router.route("/:id").get(getAlert).put(updateAlert);

module.exports = router;
