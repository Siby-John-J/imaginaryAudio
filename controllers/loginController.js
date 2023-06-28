const usermodel = require('../models/userModel')
const { authEmail, sendSMS } = require('./sending')

let email = ''
let subject = ''
let html = ''

let ph = 0
let otp = 0
let expired = false
let cd = 10

module.exports.loginEmailControl = (req, res) => {
    console.log(req.session.isUserLogin)
    
    if(!req.session.isUserLogin) {
        res.render('pages/login', {type: 'email'})
    } else {
        res.redirect(`/${req.session.username}/home`)
    }
}

module.exports.loginOTPControl = (req, res) => {
    // require the twilo and send otp by math.random()
    res.render('pages/login', {type: 'otp'})
}

module.exports.enterEmail = (req, res) => {
    // this is the page that send in to your email
    res.render('pages/login', {type: 'email-send'})
}

module.exports.forgetPassword = (req, res) => {
    // this is the page that send in to your email
    res.render('pages/login', {type: 'reset'})
}

module.exports.resendOtp = (req, res) => {
    sendSMS(ph, otp + ' is your otp from imaginaryAudio')

    expired = false
    function countdown(seconds) {
        if (seconds < 0) {
            console.log('finished')
            expired = true
            return
        }
        setTimeout(() => countdown(seconds - 1), 1000)
    }
    countdown(59)

    res.render('pages/login', {type: 'otp-resend', ph: ph})
}

module.exports.checkEmail = (req, res) => {
    authEmail(email, subject, html)
    res.render('pages/login', {type: 'check-email', email: email})
}

module.exports.auth = (req, res) => {
    if(req.body.email && req.body.password) {
        usermodel.findOne({
            email: req.body.email,
            password: req.body.password
        }).then(data => {
            if(data === null) {
                res.redirect('/')
            } else {
                req.session.isUserLogin = true
                req.session.username = data.name
                res.redirect(`/${data.name}/home`)
            }
        })
    } else if(req.body.email) {
        email = req.body.email
        subject = 'Password reset link from imaginaryAudio'
        html = 'click here to reset password http://localhost:2000/reset_password'

        authEmail(email, subject, html)
        
        res.render('pages/login', {type: 'check-email', email: req.body.email})
    } else if('password' in req.body && typeof req.body.password === 'object'){
        if(req.body.password[0] === req.body.password[1]) {
            res.redirect('/home')
        } else {
            res.send('incorrect password')
        }
    } else if(req.body.phoneNum) {
        // OTP verification

        ph = req.body.phoneNum

        let min = 1000
        let max = 9999

        let randomNumber = Math.floor(Math.random() * (max - min + 1)) + min
        otp = randomNumber
        console.log(otp, 'is this')
        sendSMS(ph, otp + ' is your otp from imaginaryAudio')

        res.render('pages/login', {type: 'enter-otp', ph: ph})
        
    } else if(req.body.otp) {
        if(otp === Number(req.body.otp)) {
            if(expired) {
                res.send('otp expired')
            } else {
                res.redirect('/home')
            }
        } else {
            res.send('wrong otp')
        }
    } else {
        res.send('this password is not existed..')
    }
}

module.exports.logout = (req, res) => {
    req.session.isUserLogin = false
    res.redirect('/')
}