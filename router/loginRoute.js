const { Router } = require( "express")
const usermiddleware = require('../middlewares/userMiddleware')
const { loginEmailControl, 
        loginOTPControl, 
        auth, 
        forgetPassword,
        enterEmail, 
        resendOtp,
        checkEmail,
        logout
        } = require("../controllers/loginController")
const router = Router()

router.get('/', loginEmailControl)
router.get('/otp_auth', loginOTPControl)

router.post('/auth', auth)
router.get('/enter_email', enterEmail)

router.get('/reset_password', forgetPassword)
router.get('/otp_resend', resendOtp)

router.get('/email_resend', checkEmail)
router.get('/logout', usermiddleware, logout)
module.exports = router
