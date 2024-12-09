const Ticket = require("../models/Ticket");

const createNewTicket = async (req, res) => {
  const userId = req.userId;
  const { name, email, subject, message, priority, attachment } = req.body;

  try {
    if (!name || !email || !subject || !message || !priority) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    const newTicket = await Ticket.createTicket(userId, {
      name,
      email,
      subject,
      message,
      priority,
      attachment: attachment || null,
    });

    res.status(201).json(newTicket);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const getUserTickets = async (req, res) => {
  const userId = req.userId;

  try {
    const tickets = await Ticket.userTickets(userId);

    if (tickets.length === 0) {
      return res
        .status(404)
        .json({ message: "No tickets found for this user" });
    }

    res.status(200).json(tickets);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const replyTicket = async (req, res) => {
  const userId = req.userId;
  const { ticketId, message } = req.body;

  try {
    if (!ticketId || !message) {
      return res
        .status(400)
        .json({ message: "Ticket ID, message are required!" });
    }

    const updatedTicket = await Ticket.replyTicket(
      ticketId,
      {
        message,
      },
      userId
    );

    res.status(200).json(updatedTicket);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const getTicket = async (req, res) => {
  const ticketId = req.params;
  try {
    const ticket = await Ticket.getTicket(ticketId);
    res.status(200).json({ ticket });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createNewTicket, getUserTickets, replyTicket, getTicket };
