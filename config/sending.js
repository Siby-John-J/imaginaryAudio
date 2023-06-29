const { createTransport } = require('nodemailer')
require('dotenv').config()

const twilo = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_TOKEN)

const transport = createTransport({
    host: process.env.SMTP_HOST,
    port: 587,
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD
    }
})

module.exports.authEmail = async(email, subject, html) => {
    await transport.sendMail({
        from: process.env.SMTP_EMAIL,
        to: email,
        subject: subject,
        html: html
    })
}

module.exports.sendSMS = (number, message) => {
    twilo.messages.create({
        body: message,
        from: process.env.TWILIO_NUMBER,
        to: '+91' + number
    })
}
