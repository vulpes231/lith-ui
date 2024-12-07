const { Schema, default: mongoose } = require("mongoose");

const verifySchema = new Schema({
  fullname: {
    type: String,
  },
  gender: {
    type: String,
  },
  occupation: {
    type: String,
  },
  image: {
    type: String,
  },
  status: {
    type: String,
  },
  account: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

verifySchema.statics.submitDetails = async function (verificationData, userId) {
  const User = require("./User");
  const { fullname, gender, occupation, image } = verificationData;

  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found!");
    }

    const userInformation = {
      fullname,
      gender,
      occupation,
      image,
      account: user._id,
      status: "pending",
    };

    const verificationRecord = new this(userInformation);

    await verificationRecord.save();

    return verificationRecord;
  } catch (error) {
    console.error(error);

    throw new Error(`Submission failed: ${error.message}`);
  }
};

module.exports = mongoose.model("Verification", verifySchema);
