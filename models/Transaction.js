const mongoose = require("mongoose");
const { format } = require("date-fns");

const currentDate = format(new Date(), "MMM dd yyyy");
const currentTime = format(new Date(), "hh:mm a");

const timeStamp = `${currentDate} @ ${currentTime}`;

const Schema = mongoose.Schema;

const trnxSchema = new Schema({
  transactionType: {
    type: [String],
    enum: ["deposit", "withdraw", "transfer", "stake"],
  },
  amount: {
    type: Number,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  coinType: {
    type: String,
  },
  network: {
    type: String,
  },
  timeStamp: {
    type: String,
  },
  status: {
    type: [String],
    enum: ["completed", "pending", "failed", "processing"],
    default: "pending",
  },
  receiver: {
    type: String,
  },
});

trnxSchema.statics.createTransaction = async function (userId, trnxData) {
  const User = require("./User");
  const Wallet = require("./Wallet");
  const { coinType, network, amount, transactionType } = trnxData;

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const user = await User.findById(userId).session(session);
    if (!user) {
      await session.abortTransaction();
      await session.endSession();
      throw new Error("User not found!");
    }

    const userWallet = await Wallet.findOne({ owner: user._id }).session(
      session
    );
    if (!userWallet) {
      await session.abortTransaction();
      await session.endSession();
      throw new Error("User wallet not found!");
    }
    const parsedAmount = parseFloat(amount);
    userWallet.balance += parsedAmount;

    await userWallet.save({ session });

    const newTransaction = new this({
      coinType,
      timeStamp: timeStamp,
      amount,
      network,
      transactionType,
      createdBy: user._id,
    });

    await newTransaction.save({ session });
    await session.commitTransaction();
    return newTransaction;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};

trnxSchema.statics.deposit = async function (userId, trnxData) {
  const User = require("./User");
  const { coinType, network, amount } = trnxData;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const user = await User.findById(userId).session(session);
    if (!user) {
      await session.abortTransaction();
      await session.endSession();
      throw new Error("User not found!");
    }

    const newTransaction = new this({
      coinType,
      amount,
      network,
      transactionType: "deposit",
      createdBy: user._id,
      timeStamp: timeStamp,
    });

    await newTransaction.save({ session });
    await session.commitTransaction();
    return newTransaction;
  } catch (error) {
    throw error;
  } finally {
    await session.endSession();
  }
};

trnxSchema.statics.withdraw = async function (userId, trnxData) {
  const User = require("./User");
  const Wallet = require("./Wallet");
  const { coinType, amount, walletAddress, pin } = trnxData;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const user = await User.findById(userId).session(session);
    if (!user) {
      await session.abortTransaction();
      await session.endSession();
      throw new Error("User not found!");
    }

    const userWallet = await Wallet.findOne({ owner: user._id }).session(
      session
    );
    if (!userWallet) {
      await session.abortTransaction();
      await session.endSession();
      throw new Error("User wallet not found!");
    }

    const parsedAmount = parseFloat(amount);

    if (userWallet.balance <= parsedAmount) {
      await session.abortTransaction();
      await session.endSession();
      throw new Error("Insufficient balance!");
    }

    if (user.pin !== pin) {
      await session.abortTransaction();
      await session.endSession();
      throw new Error("Invalid pin!");
    }

    const newTransaction = new this({
      coinType,
      amount,
      transactionType: "withdraw",
      createdBy: user._id,
      timeStamp: timeStamp,
      walletAddress,
    });

    await newTransaction.save({ session });
    await session.commitTransaction();
    return newTransaction;
  } catch (error) {
    throw error;
  } finally {
    await session.endSession();
  }
};

trnxSchema.statics.getUserTrnxs = async function (userId) {
  try {
    const userTrnxs = await this.find({ createdBy: userId });
    return userTrnxs;
  } catch (error) {
    throw error;
  }
};

const Transaction = mongoose.model("Transaction", trnxSchema);
module.exports = Transaction;
