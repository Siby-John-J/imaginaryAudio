
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
        <a href="www.imaginaudio.online">
            Click here
        </a>`
    
    bcrypt.hash(req.body.password[0], 10).then(data => {        
        usermodel.insertMany([{
            name: req.body.fullname, 
            email: email,
            password: data,
            phone: Number(req.body.phnum),
            status: true,
            wallet: 0
        }]).then(data => {})
    })
    
    console.log('created')
    authEmail(email, subject, html)
    
    res.render('pages/login', {type: 'check-email', email: req.body.email})
}

module.exports.signupCheck = async(req, res) => {
    if(req.body.type === 'name') {
        const matchUser = await usermodel.findOne({name: req.body.data})
        if(matchUser !== null) {
            res.json({msg: 'name'})
        } else {
            res.json({msg: matchUser})
        }
    } else if(req.body.type === 'email') {
        const matchUser = await usermodel.findOne({email: req.body.data})
        if(matchUser !== null) {
            res.json({msg: 'email'})
        } else {
            res.json({msg: matchUser})
        }
    }
}