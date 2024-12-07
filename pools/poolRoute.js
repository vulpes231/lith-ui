const { Router } = require("express");
const { getPoolPlans, addNewPool, investPool } = require("./poolHandler");

const router = Router();

router.route("/").get(getPoolPlans).post(addNewPool);
router.route("/invest").post(investPool);

module.exports = router;
