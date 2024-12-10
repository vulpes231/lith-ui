const { Router } = require("express");
const { loginAdmin } = require("./authHandler");

const router = Router();

router.route("/").post(loginAdmin);

module.exports = router;
