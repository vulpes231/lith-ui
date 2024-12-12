const { Router } = require("express");
const {
  getPoolPlans,
  addNewPool,
  investPool,
  getInvestments,
} = require("./poolHandler");

const router = Router();

router.route("/").get(getPoolPlans).post(addNewPool);
router.route("/invest").get(getInvestments).post(investPool);

module.exports = router;
