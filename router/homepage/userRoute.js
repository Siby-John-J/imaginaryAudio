const { Router } = require('express')
const router = Router()

const usermiddleware = require('../../middlewares/userMiddleware')
const { homepageLoad, productLoad } = require('../../controllers/homepage/homepageController')
const { cart, addToCart, countCart, removeFromCart } = require('../../controllers/user/cartController')
const { profile, orders, address } = require('../../controllers/user/profileController')

router.get('/home', usermiddleware ,homepageLoad)

router.get('/cart', usermiddleware, cart)
router.post('/cart', usermiddleware, cart)

router.get('/cart/addtocart', usermiddleware, addToCart)
router.get('/cart/countcart', usermiddleware, countCart)
router.get('/cart/remove', usermiddleware, removeFromCart)

router.get('/profile', usermiddleware, profile)
router.get('/orders', usermiddleware, orders)
router.get('/address', usermiddleware, address)

router.get('/:id', usermiddleware, productLoad)

module.exports = router