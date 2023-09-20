const { Router } = require('express')
const { signupPage, signupAuth, signupCheck } = require('../controllers/signupController')
const router = Router()

router.get('/signup', signupPage)
router.post('/signup_auth', signupAuth)
router.post('/signup/data', signupCheck)

module.exports = router