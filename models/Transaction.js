const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const trnxSchema = new Schema({
  transactionType: {
    type: [String],
    enum: ["deposit", "withdrawal", "transfer", "upgrade"],
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
  walletAddress: {
    type: String,
  },
  createdAt: {
    type: String,
  },
  status: {
    type: [String],
    enum: ["completed", "pending", "failed", "processing"],
  },
});

trnxSchema.statics.createTransaction = async function (userId, trnxData) {
  const User = require("./User");
  const Wallet = require("./Wallet");
  const { coinType, createdAt, amount, transactionType, status } = trnxData;

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
      createdAt,
      amount,
      transactionType,
      createdBy: user._id,
      status,
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
  const { coinType, amount } = trnxData;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const user = await User.findById(userId).session(session);
    if (!user) {
      await session.abortTransaction();
      await session.endSession();
      throw new Error("User not found!");
    }
    const currentDate = new Date();
    const newTransaction = new this({
      coinType,
      amount,
      transactionType: "deposit",
      createdBy: user._id,
      status: "pending",
      createdAt: currentDate,
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

    const currentDate = new Date();
    const newTransaction = new this({
      coinType,
      amount,
      transactionType: "withdrawal",
      createdBy: user._id,
      status: "pending",
      createdAt: currentDate,
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

trnxSchema.statics.markPaid = async function (trnxId) {
  const Wallet = require("./Wallet");
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userTrnx = await Transaction.findById(trnxId).session(session);
    if (!userTrnx) {
      throw new Error("Transaction not found");
    }

    const userWallet = await Wallet.findOne({
      owner: userTrnx.createdBy,
    }).session(session);
    if (!userWallet) {
      throw new Error("Wallet not found");
    }

    if (userWallet.balance < userTrnx.amount) {
      userTrnx.status = "failed";
      await userTrnx.save();
      // throw new Error("Insufficient funds. Transaction cannot be completed!");
    }

    userWallet.balance -= userTrnx.amount;
    await userWallet.save({ session });

    userTrnx.status = "failed";
    await userTrnx.save({ session });

    await session.commitTransaction();
    return { success: true, message: "Transaction marked as paid." };
  } catch (error) {
    await session.abortTransaction();
    throw error; // Rethrow the error for handling upstream
  } finally {
    session.endSession();
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
