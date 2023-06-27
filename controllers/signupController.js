const { authEmail } = require('./sending')
const usermodel = require('../models/userModel')

let email = ''
let subject = ''
let html = ''

module.exports.signupPage = (req, res) => {
    res.render('pages/signup')
}

module.exports.signupAuth = (req, res) => {
    email = req.body.email
    subject = 'link for otp verification from imaginaryAudio'
    html = 'click here to config otp verification http://localhost:2000/otp_auth'
    
    console.log(req.body)
    
    usermodel.insertMany([{
        name: req.body.fullname,
        email: email,
        password: req.body.password[0],
        status: true
    }]).then(data => {})
    
    // authEmail(email, subject, html)

    res.send('we will send you a email')
}
