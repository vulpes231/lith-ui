const { Router } = require("express");
const { getMyUsers, getUserProfile } = require("./userControl");

const router = Router();

router.route("/").get(getMyUsers);
router.route("/:userId").get(getUserProfile);

module.exports = router;
