const { Router } = require("express");
const { getInvestments, getInvestmentById } = require("./investHandler");

const router = Router();

router.route("/").get(getInvestments);
router.route("/:investId").get(getInvestmentById);

module.exports = router;
