function generateOTP() {
  // Generate a random 6-digit number
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return randomNum;
}

function generateDescription() {
  const pool = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
  let desc = "#";

  for (let i = 0; i < 15; i++) {
    const randomIndex = Math.floor(Math.random() * pool.length);
    desc += pool[randomIndex];
  }

  return desc;
}

module.exports = { generateOTP, generateDescription };
