const { Router } = require("express");
const { verifyAccount, upload } = require("./verifyHandler");

const router = Router();

router.route("/").post(upload.single("image"), verifyAccount);

module.exports = router;
