function generateOTP() {
  // Generate a random 6-digit number
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return randomNum;
}

module.exports = { generateOTP };
