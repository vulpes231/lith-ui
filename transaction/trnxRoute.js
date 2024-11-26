const express = require("express");
const {
  createNewTrnx,
  depositFunds,
  withdrawFunds,
  getUserTransactions,
  markTrnxPaid,
} = require("./trnxHandler");

const router = express.Router();
router.route("/").post(createNewTrnx).get(getUserTransactions);
router.route("/deposit").post(depositFunds);
router.route("/withdraw").post(withdrawFunds);
router.route("/markpaid").post(markTrnxPaid);

module.exports = router;
