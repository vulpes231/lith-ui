const User = require("../models/User");
const { generateOTP } = require("../utils/generate");
const Mailer = require("../utils/mailer");

const sendEmailCode = async (req, res) => {
  const { email } = req.body;
  try {
    const otp = generateOTP();
    const message = `Your email verification code is ${otp}`;
    const subject = "Email verification code";
    await Mailer(email, subject, message);
    res.status(200).json({ otp });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occured. Try again" });
  }
};

const sendLoginCode = async (req, res) => {
  const { email } = req.body;
  try {
    const loginCode = generateOTP();
    const message = `Your verification code is ${otp}`;
    const subject = "Verify your login";
    await Mailer(email, subject, message);
    res.status(200).json({ loginCode });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occured. Try again" });
  }
};

const verifyEmail = async (req, res) => {
  const { otp, original } = req.body;
  const userId = req.userId;

  if (!otp || !original)
    return res.status(400).json({ message: "Enter OTP code!" });
  try {
    const user = await User.findOne({ _id: userId });
    if (!user) return res.status(404).json({ message: "User not found!" });

    if (otp !== original)
      return res.status(400).json({ message: "Invalid OTP code" });

    user.isEmailVerified = true;

    await user.save();
    res.status(200).json({ message: "Email verified." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occured. Try again" });
  }
};

module.exports = { sendEmailCode, sendLoginCode, verifyEmail };
