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

poolSchema.statics.stakePool = async function (poolId, userId, amount) {
  try {
    const poolPlan = await this.findOne({ _id: poolId });
    if (!poolPlan) {
      throw new Error(`Pool plan with ID ${poolId} not found!`);
    }

    // Fetch the user
    const user = await User.findOne({ _id: userId });
    if (!user) {
      throw new Error(`User with ID ${userId} not found!`);
    }

    // Fetch the user's wallets
    const userWallets = await Wallet.find({ owner: user._id });
    if (userWallets.length === 0) {
      throw new Error(`No wallets found for user with ID ${userId}!`);
    }

    // Find the investment wallet
    const investmentWallet = userWallets.find((wallet) =>
      wallet.name.includes("investment")
    );
    if (!investmentWallet) {
      throw new Error(
        `Investment wallet not found for user with ID ${userId}!`
      );
    }

    // Validate the stake amount
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= poolPlan.minAmount) {
      throw new Error(
        `Amount must be greater than the minimum stake of ${poolPlan.minAmount}`
      );
    }

    // Check if the user has sufficient funds
    if (investmentWallet.balance < parsedAmount) {
      throw new Error(
        `User does not have enough funds to stake. Current balance: ${investmentWallet.balance}`
      );
    }

    const newTransaction = await Transaction.create({
      coinType: "invest",
      amount: parsedAmount,
      network: poolPlan.plan,
      transactionType: "stake",
      createdBy: user._id,
      timeStamp: timeStamp,
    });

    return newTransaction;
  } catch (error) {
    console.error(error);
    throw new Error("Error staking pool: " + error.message);
  }
};

module.exports = mongoose.model("Pool", poolSchema);
