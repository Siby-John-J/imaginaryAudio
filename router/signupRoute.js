const { Router } = require('express')
const { signupPage, signupAuth, signupCheck } = require('../controllers/signupController')
const router = Router()

router.get('/signup', signupPage)
router.post('/signup_auth', signupAuth)
router.post('/signup/data', signupCheck)

router.get('/:id', (req, res) => {
    res.render('pages/404')
})

module.exports = router