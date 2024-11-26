const Notification = require("../models/Notifications");
const User = require("../models/User");

const createAlert = async (req, res) => {
  try {
    const userId = req.userId;
    const { message, subject } = req.body;
    const notificationData = { message, subject };
    const newAlert = await Notification.createNotification(
      userId,
      notificationData
    );
    res.status(201).json({ message: "Alert created." });
  } catch (error) {
    console.log(error);
    res.status(201).json({ message: "Failed to create alert. Try again" });
  }
};

const getUserAlerts = async (req, res) => {
  const userId = req.userId;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(400).json({ message: "user not found!" });

    const userAlerts = await Notification.find({ receiver: user._id });
    res.status(200).json({ userAlerts });
  } catch (error) {
    console.log(error);
    res.status(201).json({ message: "Failed to fetch alert. Try again" });
  }
};

const getAlert = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const alert = await Notification.findOne({ _id: id });
    if (!alert) return res.status(400).json({ message: "bad request!" });

    res.status(200).json({ alert });
  } catch (error) {
    console.log(error);
    res.status(201).json({ message: "Failed to get alert. Try again" });
  }
};

const updateAlert = async (req, res) => {
  const { id } = req.params;
  try {
    const alert = await Notification.findOne({ _id: id });
    if (!alert) return res.status(400).json({ message: "bad request!" });
    alert.status = "read";
    await alert.save();
    res.status(200).json({ message: "alert updated." });
  } catch (error) {
    console.log(error);
    res.status(201).json({ message: "Failed to update alert. Try again" });
  }
};

module.exports = { createAlert, getUserAlerts, getAlert, updateAlert };
