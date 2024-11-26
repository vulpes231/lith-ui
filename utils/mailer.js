const nodemailer = require("nodemailer");

const Mailer = (email, message, subject) => {
  console.log(subject);
  const Transporter = nodemailer.createTransport({
    host: "server223.web-hosting.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_ADDRESS,
    to: email,
    subject: subject,
    html: `
    <body style="margin: 0; padding: 0;">
      <div style="text-align: center; padding: 16px; display: grid; gap: 5px;">
        <img style="background-color: white;" src="https://res.cloudinary.com/drsbkgeke/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/coinxtra_aqkvke.png" height="150" width="100%" alt="coinxtra_web_logo"/>
        <small style="margin-top: 20px; display: block;">${message}</small>
      </div>
    </body>
  `,
  };

  Transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
      console.log(info);
    }
  });
};
module.exports = Mailer;
