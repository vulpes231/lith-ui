const Transaction = require("../models/Transaction");

const createNewTrnx = async (req, res) => {
  const userId = req.userId;
  const { coinType, amount, transactionType, network } = req.body;
  try {
    const trnxData = { coinType, amount, transactionType, network };
    const trnx = await Transaction.createTransaction(userId, trnxData);
    res.status(201).json({ message: "transaction created" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const depositFunds = async (req, res) => {
  const userId = req.userId;
  const { amount, gateway } = req.body;
  try {
    const trnxData = { gateway, amount };
    await Transaction.deposit(userId, trnxData);
    res.status(200).json({ message: "deposit submitted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const withdrawFunds = async (req, res) => {
  const userId = req.userId;
  const { coinType, amount, walletaddress, pin } = req.body;
  try {
    const trnxData = { coinType, amount, walletaddress, pin };
    const trnx = await Transaction.withdraw(userId, trnxData);
    res.status(201).json({ message: "withdrawal pending" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const getUserTransactions = async (req, res) => {
  const userId = req.userId;
  try {
    const trnxs = await Transaction.getUserTrnxs(userId);
    res.status(200).json({ trnxs });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createNewTrnx,
  depositFunds,
  withdrawFunds,
  getUserTransactions,
};
