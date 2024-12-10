const User = require("../../models/User");

const getUserProfile = async (req, res) => {
  const isAdmin = req.isAdmin;
  if (!isAdmin) return res.status(403).json({ message: "forbidden access" });
  const userId = req.params;
  try {
    const userInfo = await User.findOne({ _id: userId });

    if (!userInfo) return res.status(404).jsoN({ message: "user not found" });
    res.status(200).json({ userInfo });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const getMyUsers = async (req, res) => {
  const isAdmin = req.isAdmin;
  if (!isAdmin) return res.status(403).json({ message: "forbidden access" });

  try {
    const users = await User.getAllUsers();

    res.status(200).json({ users });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getUserProfile, getMyUsers };
