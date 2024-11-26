const Wallet = require("../models/Wallet");

const getUserWalletInfo = async (req, res) => {
  const userId = req.userId;
  try {
    const wallet = await Wallet.getUserWallet(userId);
    res.status(200).json({ wallet });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "An error occured while fetching wallet details" });
  }
};

module.exports = { getUserWalletInfo };
