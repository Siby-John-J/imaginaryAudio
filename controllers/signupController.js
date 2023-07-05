
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
    subject = 'Dear ' + req.body.fullname + ' welcome to imaginaryAudio'
    html = `
        <label>Go to Login Page</label>
        <a href="http://localhost:2000">
            Click here
        </a>`
    
    // bcrypt.hash(req.body.password[0], 10).then(data => {        
    //     usermodel.insertMany([{
    //         name: req.body.fullname, 
    //         email: email,
    //         password: data,
    //         phone: Number(req.body.phnum),
    //         status: true
    //     }]).then(data => {})
    // })
    
    // authEmail(email, subject, html)

    res.render('pages/login', {type: 'check-email', email: req.body.email})
}
