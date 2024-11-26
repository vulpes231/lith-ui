const { format } = require("date-fns");
const { v4: uuid } = require("uuid");
const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");

const logEvent = async (message, fileName) => {
  const currentDate = format(new Date(), "yyyy/MM/dd\tHH:mm:ss");
  const logItem = `${currentDate}\t${uuid()}\t${message}\n`;
  const logFolderPath = path.join(__dirname, "../logs");
  const logFilePath = path.join(logFolderPath, fileName);
  try {
    if (!fs.existsSync(logFolderPath)) {
      await fsPromises.mkdir(logFolderPath);
    }
    await fsPromises.appendFile(logFilePath, logItem);
  } catch (error) {
    console.error(error);
  }
};

module.exports = { logEvent };
