const nodemailer = require('nodemailer')


const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER, // emaul domain from where u want to trigger the email
      pass: "", // password of your app passcode
    },
})

module.exports = transporter