const nodemailer = require("nodemailer");
require("dotenv").config();

const transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASSWORD,
  },
});

// const message = {
//   to: "mywork1728@gmail.com",
//   from: "mywork1728@gmail.com",
//   subject: "lololo",
//   // html: "<h1>Hello world</h1>",
//   text: "Hello worlD",
// };

function sendEmail(message) {
  message.from = "mywork1728@gmail.com";
  return transport.sendMail(message);
}

// .then((response) => console.log(response))
// .catch((error) => console.log(error));

module.exports = sendEmail;
