const express = require("express");
const { connectDB } = require("./configs/connectDB");
const { default: mongoose } = require("mongoose");
const cookieParser = require("cookie-parser");
const { reqLogger, errorLogger } = require("./middlewares/logger");
const { corsOptions } = require("./configs/corsOptions");
require("dotenv").config();
const cors = require("cors");
const { verifyJWT } = require("./middlewares/verifyJWT");

const app = express();

connectDB();
const PORT = process.env.PORT || 3000;

app.use(reqLogger);

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

app.use("/signup", require("./register/registerRoute"));
app.use("/signin", require("./auth/loginRoute"));
app.use("/send", require("./sendmail/sendMailRoute"));
app.use("/", require("./routes/root"));

// user endpoints with auth
app.use(verifyJWT);
app.use("/user", require("./userprofile/userRoute"));
app.use("/wallet", require("./wallet/walletRoute"));
app.use("/transaction", require("./transaction/trnxRoute"));
app.use("/alert", require("./notification/alertRoute"));

app.use(errorLogger);

mongoose.connection.once("connected", () => {
  app.listen(PORT, () =>
    console.log(`Server started on http://localhost:${PORT}`)
  );
});
