const { logEvent } = require("../utils/eventLogger");

const reqLogger = (req, res, next) => {
  logEvent(`${req.method}\t\t${req.url}`, "req.txt");
  next();
};

const errorLogger = (err, req, res, next) => {
  logEvent(`${err.stack}\t${err.message}`, "error.txt");
  next();
};

module.exports = { reqLogger, errorLogger };
