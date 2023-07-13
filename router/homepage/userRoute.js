const { Router } = require('express')
const router = Router()

const usermiddleware = require('../../middlewares/userMiddleware')
const { homepageLoad, productLoad } = require('../../controllers/homepage/homepageController')
const { cart, addToCart, countCart, removeFromCart } = require('../../controllers/user/cartController')
const { profile, address, addAddress, removeAddress, editAddress, editProfile, saveAddress } = require('../../controllers/user/profileController')
const { orders, placeOrder, removeOrder, viewOrder } = require('../../controllers/user/orderController')

router.get('/home', usermiddleware ,homepageLoad)

router.get('/cart', usermiddleware, cart)
router.post('/cart', usermiddleware, cart)

router.get('/cart/addtocart', usermiddleware, addToCart)
router.get('/cart/countcart', usermiddleware, countCart)
router.get('/cart/remove', usermiddleware, removeFromCart)

router.get('/profile', usermiddleware, profile)
router.post('/profile', usermiddleware, editProfile)

router.get('/orders', usermiddleware, orders)
router.post('/orders/place_order', usermiddleware, placeOrder)
router.get('/orders/view_order', usermiddleware, viewOrder)
router.get('/orders/remove_order', usermiddleware, removeOrder)

router.get('/address', usermiddleware, address)
router.post('/address/add_address', usermiddleware, addAddress)
router.get('/address/delete_address', usermiddleware, removeAddress)
router.get('/address/edit_address', usermiddleware, editAddress)
router.post('/address/edit_address', usermiddleware, editAddress)

router.get('/:id', usermiddleware, productLoad)

module.exports = router