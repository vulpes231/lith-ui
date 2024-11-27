const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const { password } = require("bun");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  country: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  firstname: {
    type: String,
  },
  lastname: {
    type: String,
  },
  street: {
    type: String,
  },
  state: {
    type: String,
  },
  city: {
    type: String,
  },
  zipcode: {
    type: String,
  },
  isKycVerified: {
    type: Boolean,
    default: false,
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  referral: {
    type: String,
  },
  totalInvestment: {
    type: Number,
    default: 0,
  },
  totalProfit: {
    type: Number,
    default: 0,
  },
});

userSchema.statics.registerUser = async function (userData) {
  const Wallet = require("./Wallet");
  const session = await mongoose.startSession();
  session.startTransaction();

  const { username, email, country, phone, password } = userData;

  try {
    const userExist = await this.findOne({ username }).session(session);
    if (userExist) {
      throw new Error("Username already taken!");
    }

    const emailExist = await this.findOne({ email }).session(session);
    if (emailExist) {
      throw new Error("Email already registered!");
    }

    const phoneExist = await this.findOne({ phone }).session(session);
    if (phoneExist) {
      throw new Error("Phone number already registered!");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const createdUser = await this.create(
      {
        username: username.toLowerCase(),
        password: hashedPassword,
        email: email.toLowerCase(),
        country,
        phone,
      },
      { session }
    );

    await Wallet.create(
      [
        { walletName: "investment wallet", owner: createdUser._id },
        { walletName: "deposit wallet", owner: createdUser._id },
      ],
      { session }
    );

    const accessToken = jwt.sign(
      { username: createdUser.username, userId: createdUser._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "5h" }
    );

    const refreshToken = jwt.sign(
      { username: createdUser.username, userId: createdUser._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    createdUser.refreshToken = refreshToken;

    await session.commitTransaction();
    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Error during user registration:", error);
    await session.abortTransaction();
    throw new Error("Error registering new user: " + error.message);
  } finally {
    session.endSession();
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

  const {
    username,
    email,
    phone,
    firstname,
    lastname,
    street,
    state,
    city,
    zipcode,
  } = userData;
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
    if (firstname) {
      user.firstname = firstname;
    }
    if (lastname) {
      user.lastname = lastname;
    }
    if (street) {
      user.street = street;
    }
    if (state) {
      user.state = state;
    }
    if (city) {
      user.city = city;
    }
    if (zipcode) {
      user.zipcode = zipcode;
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
