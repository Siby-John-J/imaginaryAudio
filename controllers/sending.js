const { createTransport } = require('nodemailer')
const twilo = require('twilio')('ACdddd60fd70a954677bea5dc34032a466', '06a43e9535e53a109122a7c12414563e')

const transport = createTransport({
    host: 'smtp-relay.sendinblue.com',
    port: 587,
    auth: {
        user: 'sibyswift@gmail.com',
        pass: 'V50OPMQskv8BCSER'
    }
})

module.exports.authEmail = async (email, subject, html) => {
    await transport.sendMail({
        from: 'sibyswift@gmail.com',
        to: email,
        subject: subject,
        html: html
    })
}

module.exports.sendSMS = (number, message) => {
    twilo.messages.create({
        body: message,
        from: '+14178052162',
        to: '+91' + number
    })
}
