const User = require("../models/User");

const signupUser = async (req, res) => {
  const { username, email, country, phone, password } = req.body;
  if (!username || !password || !email || !country || !phone)
    return res.status(400).json({ message: "incomplete user data!" });
  try {
    const userData = {
      username,
      password,
      country,
      email,
      phone,
    };

    console.log(userData);

    const tokens = await User.registerUser(userData);
    const { accessToken, refreshToken } = tokens;

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
    });
    res
      .status(201)
      .json({ message: "user created successfully.", accessToken });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "an error occured during login. try again" });
  }
};

module.exports = { signupUser };
