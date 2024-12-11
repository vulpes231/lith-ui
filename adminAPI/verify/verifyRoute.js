const { Router } = require("express");
const { verifyUserInfo, getVerificationDetails } = require("./verifyHandler");

const router = Router();

router.route("/:userId").get(getVerificationDetails).put(verifyUserInfo);
module.exports = router;
