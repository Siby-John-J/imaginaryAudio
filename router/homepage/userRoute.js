const { Router } = require('express')
const router = Router()

const usermiddleware = require('../../middlewares/userMiddleware')
const { homepageLoad } = require('../../controllers/homepage/homepageController')

router.get('/home', usermiddleware ,homepageLoad)

module.exports = router