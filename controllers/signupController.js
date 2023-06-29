
const bcrypt = require('bcrypt')

const { authEmail } = require('../config/sending')
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

    bcrypt.hash(req.body.password[0], 10).then(data => {        
        usermodel.insertMany([{
            name: req.body.fullname,
            email: email,
            password: data,
            status: true
        }]).then(data => {})
    })
    
    // authEmail(email, subject, html)

    res.send('we will send you a email')
}
