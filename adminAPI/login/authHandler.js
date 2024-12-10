const Admin = require("../../models/Admin");

const loginAdmin = async (req, res) => {
  const { username, password } = req.body;
  const isAdmin = req.isAdmin;
  if (!username || !password)
    return res.status(400).json({ message: "username and password required!" });

  if (!isAdmin) return res.status(403).json({ message: "forbidden access!" });
  try {
    const loginData = { username, password };
    const tokens = await Admin.auth(loginData);
    const { accessToken, refreshToken } = tokens;

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
    });

    res.status(200).json({ message: "admin logged in", accessToken });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { loginAdmin };
