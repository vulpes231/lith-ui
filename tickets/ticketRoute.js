const { Router } = require("express");
const {
  createNewTicket,
  getUserTickets,
  getTicket,
} = require("./ticketHandler");

const router = Router();

router.route("/").post(createNewTicket).get(getUserTickets);
router.route("/:ticketId").get(getTicket);

module.exports = router;
