const express = require("express");
const {
  createNewTrnx,
  depositFunds,
  withdrawFunds,
  getUserTransactions,
} = require("./trnxHandler");

const router = express.Router();
router.route("/").post(createNewTrnx).get(getUserTransactions);
router.route("/deposit").post(depositFunds);
router.route("/withdraw").post(withdrawFunds);

module.exports = router;
