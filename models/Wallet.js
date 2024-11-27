const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const walletSchema = new Schema({
  walletName: {
    type: String,
  },
  balance: {
    type: Number,
    default: 0,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

walletSchema.statics.getUserWallet = async function (userId) {
  try {
    const userWallet = await this.find({ owner: userId });
    if (!userWallet) {
      throw new Error("User wallet not found!");
    }
    return userWallet;
  } catch (error) {
    throw new Error("Error fetching user wallet info");
  }
};

const Wallet = mongoose.model("Wallet", walletSchema);
module.exports = Wallet;
