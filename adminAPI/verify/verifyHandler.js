const User = require("../../models/User");
const Verification = require("../../models/Verification");

const getVerificationDetails = async (req, res) => {
  const { userId } = req.params;
  try {
    const verificationInfo = await Verification.findOne({ account: userId });
    if (!verificationInfo)
      return res.status(404).json({ message: "No ducments submitted yet!" });
    res.status(200).json({ verificationInfo });
  } catch (error) {
    console.log(error);
    res.json(500).json({ message: error.message });
  }
};

const verifyUserInfo = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findOne({ _id: userId });
    if (!user) return res.status(404).json({ message: "User not found!" });

    if (user.isKycVerified)
      return res.status(400).json({ message: "user already verified" });

    const verificationInfo = await Verification.findOne({ account: userId });
    if (!verificationInfo)
      return res.status(404).json({ message: "No ducments submitted yet!" });

    verificationInfo.status = "completed";

    await verificationInfo.save();
    user.isKycVerified = true;
    await user.save();
    res.status(200).json({ message: "user verified" });
  } catch (error) {
    console.log(error);
    res.json(500).json({ message: error.message });
  }
};

module.exports = { getVerificationDetails, verifyUserInfo };
