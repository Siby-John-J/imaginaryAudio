const { Router } = require('express')
const router = Router()

const usermiddleware = require('../../middlewares/userMiddleware')
const { homepageLoad, productLoad } = require('../../controllers/homepage/homepageController')
const { cart, addToCart, countCart, removeFromCart } = require('../../controllers/user/cartController')
const { profile, address, addAddress } = require('../../controllers/user/profileController')
const { orders, placeOrder, removeOrder } = require('../../controllers/user/orderController')

router.get('/home', usermiddleware ,homepageLoad)

router.get('/cart', usermiddleware, cart)
router.post('/cart', usermiddleware, cart)

router.get('/cart/addtocart', usermiddleware, addToCart)
router.get('/cart/countcart', usermiddleware, countCart)
router.get('/cart/remove', usermiddleware, removeFromCart)

router.get('/profile', usermiddleware, profile)
router.post('/profile', usermiddleware, profile)

router.get('/orders', usermiddleware, orders)
router.post('/orders/place_order', usermiddleware, placeOrder)
router.get('/orders/remove_order', usermiddleware, removeOrder)

router.get('/address', usermiddleware, address)
router.post('/address/add_address', usermiddleware, addAddress)

router.get('/:id', usermiddleware, productLoad)

module.exports = router