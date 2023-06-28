const { Router } = require('express')
const router = Router()

const { homepageLoad } = require('../../controllers/homepage/homepageController')

router.get('/home', homepageLoad)

module.exports = router