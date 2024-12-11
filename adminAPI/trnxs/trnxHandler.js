const Transaction = require("../../models/Transaction");

const getAlltrnxs = async (req, res) => {
  const isAdmin = req.isAdmin;

  if (!isAdmin) return res.status(403).json({ message: "forbidden access" });

  try {
    const transactions = await Transaction.myTrnxs();
    res.status(200).json({ transactions });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const getTransaction = async (req, res) => {
  const isAdmin = req.isAdmin;

  if (!isAdmin) return res.status(403).json({ message: "forbidden access" });
  const { transactionId } = req.params;
  if (!transactionId) return res.status(400).json({ message: "bad request" });
  try {
    const transaction = await Transaction.getTrnx(transactionId);
    res.status(200).json({ transaction });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const approveDeposit = async (req, res) => {
  const isAdmin = req.isAdmin;
  if (!isAdmin) return res.status(403).json({ message: "forbidden access" });

  const { transactionId } = req.params;
  if (!transactionId) return res.status(400).json({ message: "bad request" });

  try {
    await Transaction.approveTrnx(transactionId);
    res.status(200).json({ message: "Transaction approved." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const rejectDeposit = async (req, res) => {
  const isAdmin = req.isAdmin;
  if (!isAdmin) return res.status(403).json({ message: "forbidden access" });

  const { transactionId } = req.params;
  if (!transactionId) return res.status(400).json({ message: "bad request" });
  try {
    await Transaction.rejectTrnx(transactionId);
    res.status(200).json({ message: "Transaction rejected." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAlltrnxs, approveDeposit, rejectDeposit, getTransaction };
