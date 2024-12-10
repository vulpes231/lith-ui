const Transaction = require("../../models/Transaction");

const getInvestments = async (req, res) => {
  const isAdmin = req.isAdmin;
  if (!isAdmin) return res.status(403).json({ message: "forbidden access" });
  try {
    const allTrnxs = await Transaction.find();

    const investments = allTrnxs.filter(
      (trnx) => trnx.transactionType === "invest"
    );
    res.status(200).json({ investments });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const getInvestmentById = async (req, res) => {
  const isAdmin = req.isAdmin;
  if (!isAdmin) return res.status(403).json({ message: "forbidden access" });

  const { investId } = req.params;
  try {
    const allTrnxs = await Transaction.find();

    const investments = allTrnxs.filter(
      (trnx) => trnx.transactionType === "invest"
    );

    const investInfo = investments.find((inv) => inv._id === investId);
    res.status(200).json({ investInfo });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getInvestments, getInvestmentById };
