const { Router } = require("express");
const { newAdmin } = require("./createAdmin");

const router = Router();

router.route("/").post(newAdmin);

module.exports = router;
