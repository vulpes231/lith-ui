const express = require("express");
const { getUserWalletInfo } = require("./walletHandler");

const router = express.Router();
router.route("/").get(getUserWalletInfo);

module.exports = router;
