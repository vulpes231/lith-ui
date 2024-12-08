const { Router } = require("express");
const { createNewTicket, getUserTickets } = require("./ticketHandler");

const router = Router();

router.route("/").post(createNewTicket).get(getUserTickets);

module.exports = router;
