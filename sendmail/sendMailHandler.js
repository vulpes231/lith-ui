const Mailer = require("../utils/mailer");

const sendEmail = async (req, res) => {
  const { message, subject, email } = req.body;

  if (!email || !subject || !message)
    return res
      .status(400)
      .json({ message: "email, subject, message are required!" });

  try {
    await Mailer(email, message, subject);
    res.status(200).json({ message: `email sent to ${email} successfully` });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { sendEmail };
