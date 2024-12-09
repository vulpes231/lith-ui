const Pools = require("../models/Pools");

const addNewPool = async (req, res) => {
  const { plan, roi, yield, minAmount, maxAmount, maxEarnings, totalReturns } =
    req.body;

  try {
    const poolData = {
      plan,
      roi,
      yield,
      minAmount,
      maxAmount,
      maxEarnings,
      totalReturns,
    };
    await Pools.createPool(poolData);
    res.status(201).json({ message: "package added" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const getPoolPlans = async (req, res) => {
  try {
    const pools = await Pools.getPools();
    res.status(200).json({ pools });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const investPool = async (req, res) => {
  const userId = req.userId;
  const { wallet, planId, amount } = req.body;
  try {
    const investData = {
      walletName: wallet,
      planId,
      amount,
    };
    await Pools.stakePool(userId, investData);
    res.status(200).json({ message: "Position submitted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { investPool, getPoolPlans, addNewPool };
