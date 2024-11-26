const Transaction = require("../models/Transaction");

const createNewTrnx = async (req, res) => {
  const userId = req.userId;
  const { coinType, createdAt, amount, transactionType, status } = req.body;
  try {
    const trnxData = { coinType, createdAt, amount, transactionType, status };
    const trnx = await Transaction.createTransaction(userId, trnxData);
    res.status(201).json({ message: "transaction created" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const depositFunds = async (req, res) => {
  const userId = req.userId;
  const { coinType, amount } = req.body;
  try {
    const trnxData = { coinType, amount };
    const trnx = await Transaction.deposit(userId, trnxData);
    res.status(200).json({ message: "deposit pending" });
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

const markTrnxPaid = async (req, res) => {
  const { trnxId } = req.body;
  // const userId = req.userId;
  try {
    const trnx = await Transaction.markPaid(trnxId);
    console.log(trnx);
    res.status(200).json({ trnx });
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
  markTrnxPaid,
};
