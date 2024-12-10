const Admin = require("../../models/Admin");

const newAdmin = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: "incomplete admin data!" });
  try {
    const adminData = {
      username,
      password,
    };

    console.log(adminData);

    await Admin.createAdmin(adminData);

    res.status(201).json({ message: "Admin created successfully." });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "an error occured during register. try again" });
  }
};

module.exports = { newAdmin };
