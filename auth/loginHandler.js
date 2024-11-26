const User = require("../models/User");

const signinUser = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: "username and password required!" });
  try {
    const loginData = { username, password };
    const tokens = await User.loginUser(loginData);
    const { accessToken, refreshToken } = tokens;

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
    });

    res.status(200).json({ message: "user logged in", accessToken });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { signinUser };
