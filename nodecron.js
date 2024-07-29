const cron = require("node-cron");

const nodemailer = require("nodemailer");

require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const mailOptions = {
  from: process.env.EMAIL_USER,
  to: "jaykyada3700@gmail.com",
  subject: "Password Reset",
  text: `You requested a password reset.`,
};

cron.schedule("13 12 * * *", () => {
  transporter.sendMail(mailOptions, function (err, info) {
    if (err) console.log(err);
    else console.log(info);
  });
});
