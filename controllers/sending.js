const { createTransport } = require('nodemailer')
const twilo = require('twilio')('ACdddd60fd70a954677bea5dc34032a466', '18e28059f06ec6e86ff2793c14d7a534')

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
    // console.log(typeof number, message)
}
