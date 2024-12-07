const multer = require("multer");
const path = require("path");
const Verification = require("../models/Verification");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    const username = req.body.fullname.replace(/\s+/g, "");
    const extname = path.extname(file.originalname);
    cb(null, `${username}Image${extname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Invalid file type, only JPEG, PNG and JPG are allowed!"),
      false
    );
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

const verifyAccount = async (req, res) => {
  const { fullname, gender, occupation } = req.body;

  if (!fullname || !gender || !occupation || !req.file)
    return res.status(400).json({
      message: `${
        !fullname
          ? "Fullname required!"
          : !gender
          ? "Gender required!"
          : !occupation
          ? "Occupation required!"
          : !req.file
          ? "Image required!"
          : "Incomplete verification data!"
      }`,
    });

  try {
    const image = `${req.protocol}://${req.get("host")}/uploads/${
      req.file.filename
    }`;

    const verificationData = { fullname, gender, occupation, image };
    const verificationDetails = await Verification.submitDetails(
      verificationData
    );
    res
      .status(201)
      .json({ message: "Verification pending.", verificationDetails });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { verifyAccount, upload };
