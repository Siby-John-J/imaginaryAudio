const { Router } = require('express')
const { signupPage, signupAuth } = require('../controllers/signupController')
const router = Router()

router.get('/signup', signupPage)
router.post ('/signup_auth', signupAuth)

module.exports = router