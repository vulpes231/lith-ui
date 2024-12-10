const { mongoose, Schema } = require("mongoose");
const bcrypt = require("bcryptjs");

const adminSchema = new Schema({
  username: {
    type: String,
  },
  password: {
    type: String,
  },
  isAdmin: {
    type: Boolean,
    default: true,
  },
});

adminSchema.statics.auth = async function (loginData) {
  const { username, password } = loginData;
  try {
    const admin = await this.findOne({ username: username });

    if (!admin) {
      throw new Error("Admin does not exist!");
    }
    const passwordMatch = await bcrypt.compare(password, admin.password);
    if (!passwordMatch) {
      throw new Error("Invalid username or password!");
    }

    const accessToken = jwt.sign(
      { username: admin.username, adminId: admin._id, isAdmin: admin.isAdmin },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "5h" }
    );

    const refreshToken = jwt.sign(
      { username: admin.username, adminId: admin._id, isAdmin: admin.isAdmin },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    admin.refreshToken = refreshToken;
    return { accessToken, refreshToken };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

adminSchema.statics.createAdmin = async function (adminData) {
  const { username, password } = adminData;
  try {
    const adminExist = await this.findOne({ username });
    if (adminExist) {
      throw new Error("Username already taken!");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const createdUser = await this.create([
      {
        username: username.toLowerCase(),
        password: hashedPassword,
      },
    ]);

    return { createdUser };
  } catch (error) {
    console.error("Error during user registration:", error);

    throw new Error("Error registering new admin: " + error.message);
  }
};

adminSchema.statics.getAdmin = async function (adminId) {
  try {
    const admin = await this.findById(adminId);
    if (!admin) {
      throw new Error("Admin not found!");
    }

    return admin;
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching admin: " + error.message);
  }
};

module.exports = mongoose.model("Admin", adminSchema);
