const { Schema, default: mongoose } = require("mongoose");

const ticketSchema = new Schema(
  {
    subject: {
      type: String,
      required: true,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    priority: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    messages: [
      {
        sender: {
          type: String,
          required: true,
        },
        message: {
          type: String,
          required: true,
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    attachment: {
      type: String,
    },
    status: {
      type: String,
      default: "open",
    },
    lastReplied: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const User = require("./User");

ticketSchema.statics.createTicket = async function (userId, ticketData) {
  const { name, email, subject, message, priority, attachment } = ticketData;
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found!");
    }

    const newTicket = new this({
      name,
      email,
      subject,
      priority,
      attachment,
      creator: user._id,
      messages: [
        {
          sender: user.username,
          message,
        },
      ],
    });

    await newTicket.save();
    return newTicket;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

ticketSchema.statics.replyTicket = async function (
  ticketId,
  replyData,
  userId
) {
  const { message } = replyData;
  try {
    const ticket = await this.findById(ticketId);
    if (!ticket) {
      throw new Error("Ticket not found!");
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found!");
    }

    ticket.messages.push({
      sender: user.username,
      message,
    });

    ticket.lastReplied = new Date();

    await ticket.save();
    return ticket;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

ticketSchema.statics.userTickets = async function (userId) {
  try {
    const tickets = await this.find({ creator: userId }).sort({
      createdAt: -1,
    });
    return tickets;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

ticketSchema.statics.getTicket = async function (ticketId) {
  try {
    // console.log(ticketId);
    const ticket = await this.findById(ticketId.ticketId);
    if (!ticket) {
      throw new Error("Ticket not found!");
    }
    return ticket;
  } catch (error) {
    throw error;
  }
};

const Ticket = mongoose.model("Ticket", ticketSchema);
module.exports = Ticket;
