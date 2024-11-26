const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const jwt = require("jsonwebtoken");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  fullname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
  },
  pin: {
    type: String,
    required: true,
  },
  invitation: {
    type: String,
  },
  bindAddress: {
    type: String,
  },
  homeAddress: {
    type: String,
  },
  coinType: {
    type: String,
    default: "bitcoin",
  },
  level: {
    type: Number,
    default: 0,
  },
});

userSchema.statics.registerUser = async function (userData) {
  const Wallet = require("./Wallet");
  const session = await mongoose.startSession();
  session.startTransaction();

  // console.log("Registering user with data:", userData);

  const { username, password, fullname, email, homeAddress, bindAddress, pin } =
    userData;

  try {
    const userExist = await this.findOne({ username }).session(session);
    if (userExist) {
      console.log("User already exists:", username);
      await session.abortTransaction();
      session.endSession();
      throw new Error("user already exists!");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    // console.log("Password hashed successfully.");

    const createdUser = new this({
      username: username.toLowerCase(),
      password: hashedPassword,
      fullname: fullname.toLowerCase(),
      email: email.toLowerCase(),
      bindAddress: bindAddress || "",
      homeAddress: homeAddress || "",
      pin,
    });

    await createdUser.save({ session });

    await Wallet.create({
      address: "bc1q2yt2fr7xjfeyrh88c3qns9m6nl0px39m2ue9gm",
      owner: createdUser._id,
    });

    await session.commitTransaction();
    session.endSession();

    return createdUser;
  } catch (error) {
    console.error("Error during user registration:", error);
    await session.abortTransaction();
    session.endSession();
    throw new Error("error registering new user!");
  }
};

userSchema.statics.loginUser = async function (loginData) {
  const session = await mongoose.startSession();
  session.startTransaction();

  const { username, password } = loginData;
  let transactionAborted = false;

  try {
    const user = await this.findOne({
      username: username.toLowerCase(),
    }).session(session);

    if (!user) {
      transactionAborted = true;
      throw new Error("User does not exist!");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      transactionAborted = true;
      throw new Error("Invalid username or password!");
    }

    const accessToken = jwt.sign(
      { username: user.username, userId: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "5h" }
    );

    const refreshToken = jwt.sign(
      { username: user.username, userId: user._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    user.refreshToken = refreshToken;

    await user.save({ session });

    await session.commitTransaction();
    return { accessToken, refreshToken };
  } catch (error) {
    console.log(error);
    if (!transactionAborted) {
      await session.abortTransaction();
    }
    throw error;
  } finally {
    session.endSession();
  }
};

userSchema.statics.getUserInfo = async function (userId) {
  try {
    const user = await this.findById(userId);
    if (!user) {
      throw new Error("user not found!");
    }
    return user;
  } catch (error) {
    throw new Error("error fetching user details");
  }
};

userSchema.statics.editUserInfo = async function (userId, userData) {
  const session = await mongoose.startSession();
  session.startTransaction();

  const { username, email, phone, bindAddress, homeAddress } = userData;
  try {
    const user = await this.findById(userId).session(session);
    if (!user) {
      await session.abortTransaction();
      session.endSession();
      throw new Error("user does not exists!");
    }

    if (username) {
      user.username = username;
    }
    if (email) {
      user.email = email;
    }
    if (phone) {
      user.phone = phone;
    }
    if (bindAddress) {
      user.bindAddress = bindAddress;
    }
    if (homeAddress) {
      user.homeAddress = homeAddress;
    }

    await user.save({ session });

    await session.commitTransaction();
    session.endSession();

    return user;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new Error("error updating user!");
  }
};

userSchema.statics.changePassword = async function (userId, passData) {
  const session = await mongoose.startSession();
  session.startTransaction();

  const { password, newPassword } = passData;
  try {
    const user = await this.findById(userId).session(session);
    if (!user) {
      await session.abortTransaction();
      session.endSession();
      throw new Error("user does not exists!");
    }

    const passMatch = await bcrypt.compare(password, user.password);
    if (!passMatch) {
      await session.abortTransaction();
      session.endSession();
      throw new Error("invalid password!");
    }

    const hashNewPass = await bcrypt.hash(newPassword, 10);
    user.password = hashNewPass;

    await user.save({ session });

    await session.commitTransaction();
    session.endSession();

    return user;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new Error("error changing password!");
  }
};

userSchema.statics.logoutUser = async function (userId) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = await this.findById(userId).session(session);
    if (!user) {
      await session.abortTransaction();
      session.endSession();
      throw new Error("user does not exists!");
    }

    user.refreshToken = null;

    await user.save({ session });

    await session.commitTransaction();
    session.endSession();

    return user;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new Error("error during logout!");
  }
};

userSchema.statics.getAllUsers = async function () {
  try {
    const users = await this.find();
    return users;
  } catch (error) {
    throw new Error("error fetching users");
  }
};

const User = mongoose.model("User", userSchema);
module.exports = User;
