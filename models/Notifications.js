const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const notificationSchema = new Schema({
  subject: {
    type: String,
  },
  message: {
    type: String,
  },
  status: {
    type: String,
    default: "unread",
  },
  receiver: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

notificationSchema.statics.createNotification = async function (
  userId,
  notificationData
) {
  const User = require("./User");
  try {
    const { message, subject } = notificationData;
    const user = await User.findById(userId);

    if (!user) {
      throw new Error(`User with ID ${userId} not found!`);
    }

    const newNotification = new this({
      message,
      subject,
      receiver: user._id,
    });

    // Save the new notification to the database
    const savedNotification = await newNotification.save();
    return savedNotification; // Return the saved notification
  } catch (error) {
    throw new Error(`Failed to create notification: ${error.message}`);
  }
};

const Notification = mongoose.model("Notification", notificationSchema);
module.exports = Notification;
