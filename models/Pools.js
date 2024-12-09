const mongoose = require("mongoose");
const User = require("./User");
const Wallet = require("./Wallet");
const Transaction = require("./Transaction");

const { format } = require("date-fns");

const currentDate = format(new Date(), "MMM dd yyyy");
const currentTime = format(new Date(), "hh:mm a");

const timeStamp = `${currentDate} @ ${currentTime}`;

const Schema = mongoose.Schema;

const poolSchema = new Schema({
  plan: {
    type: String,
  },
  roi: {
    type: Number,
  },
  yield: {
    type: Number,
  },
  minAmount: {
    type: Number,
  },
  maxAmount: {
    type: Number,
  },
  maxEarnings: {
    type: Number,
  },
  totalReturns: {
    type: Number,
  },
});

poolSchema.statics.createPool = async function (poolData) {
  const { plan, roi, yield, minAmount, maxAmount, maxEarnings, totalReturns } =
    poolData;
  try {
    const newPackage = new this({
      plan,
      roi,
      yield,
      minAmount,
      maxAmount,
      maxEarnings,
      totalReturns,
    });
    await newPackage.save();
    return newPackage;
  } catch (error) {
    console.log(error);
    throw new Error("Error creating packages");
  }
};

poolSchema.statics.getPools = async function () {
  try {
    const pools = await this.find();
    return pools;
  } catch (error) {
    console.log(error);
    throw new Error("Error fetching packages");
  }
};

poolSchema.statics.stakePool = async function (userId, investData) {
  const { walletName, planId, amount } = investData;
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const poolPlan = await this.findOne({ _id: planId }).session(session);
    if (!poolPlan) {
      throw new Error(`Pool plan with ID ${planId} not found!`);
    }

    const user = await User.findOne({ _id: userId }).session(session);
    if (!user) {
      throw new Error(`User with ID ${userId} not found!`);
    }

    const userWallets = await Wallet.find({ owner: user._id }).session(session);
    if (userWallets.length === 0) {
      throw new Error(`No wallets found for user with ID ${userId}!`);
    }

    const investmentWallet = userWallets.find(
      (wallet) => wallet.name === walletName
    );
    if (!investmentWallet) {
      throw new Error(
        `Investment wallet not found for user with ID ${userId}!`
      );
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= poolPlan.minAmount) {
      throw new Error(
        `Amount must be greater than the minimum stake of ${poolPlan.minAmount}`
      );
    }

    if (investmentWallet.balance < parsedAmount) {
      throw new Error(
        `Insufficient balance. Current balance: ${investmentWallet.balance}`
      );
    }

    investmentWallet.balance -= parsedAmount;

    await investmentWallet.save({ session });

    const timeStamp = new Date();
    const newTransaction = await Transaction.create(
      [
        {
          gateway: walletName,
          amount: parsedAmount,
          network: poolPlan.plan,
          transactionType: "invest",
          createdBy: user._id,
          timeStamp: timeStamp,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return newTransaction[0];
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error(error);
    throw new Error("Error staking pool: " + error.message);
  }
};

module.exports = mongoose.model("Pool", poolSchema);
