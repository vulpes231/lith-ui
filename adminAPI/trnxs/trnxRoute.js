const { Router } = require("express");
const {
  getAlltrnxs,
  getTransaction,
  approveDeposit,
  rejectDeposit,
} = require("./trnxHandler");

const router = Router();

router.route("/").get(getAlltrnxs);
router
  .route("/:transactionId")
  .get(getTransaction)
  .post(approveDeposit)
  .put(rejectDeposit);

module.exports = router;
