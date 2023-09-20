const { Router } = require('express')
const router = Router()

const usermiddleware = require('../../middlewares/userMiddleware')
const { 
        homepageLoad, 
        productLoad, 
        listpageLoad
       } = require('../../controllers/homepage/homepageController')
const { 
        cart, 
        addToCart,
        countCart,
        removeFromCart,
        clearCart
        } = require('../../controllers/user/cartController')
const { 
        profile, 
        address, 
        addAddress, 
        removeAddress, 
        editAddress, 
        editProfile,
        saveAddress 
        } = require('../../controllers/user/profileController')
const { 
        orders, 
        placeOrder, 
        removeOrder, 
        viewOrder, 
        authOrder,
        setPayment,
        setAddress,
        showPayment,
        returnOrder,
        setPrice,
        invoice
    } = require('../../controllers/user/orderController')
const { checkout } = require('../../controllers/user/checkoutController')
const { wallet, card } = require('../../controllers/user/walletAndCardController')
const { applyCoupon, fetchCooupon, setCoupon, couponDetails } = require('../../controllers/user/couponController')
const { loadProducts } = require('../../controllers/user/productController')
const { setReview } = require('../../controllers/user/reviewController')
const { setToCheckout } = require('../../controllers/admin/orderController')

router.get('/home', usermiddleware ,homepageLoad)
router.post('/list', usermiddleware, listpageLoad)

router.get('/cart', usermiddleware, cart)
router.post('/cart', usermiddleware, cart)

router.get('/products', usermiddleware, loadProducts)
router.post('/:id/review', usermiddleware, setReview)

router.get('/cart/addtocart', usermiddleware, addToCart)
router.get('/cart/countcart', usermiddleware, countCart)
router.get('/cart/remove', usermiddleware, removeFromCart)
router.get('/cart/clear',usermiddleware, clearCart)

router.get('/wallet', usermiddleware, card)
router.post('/apply_coupon', usermiddleware, applyCoupon)

router.get('/checkout', usermiddleware, checkout)
router.post('/checkout', usermiddleware, checkout)
router.post('/checkout/auth_order', usermiddleware, authOrder)

router.get('/success', usermiddleware, placeOrder)
router.post('/success', usermiddleware, placeOrder)

router.post('/setaddress', usermiddleware, setAddress)

// router.post('/place_order', usermiddleware, placeOrder)
router.post('/getcoupon', usermiddleware, fetchCooupon)
router.post('/getcoupon/details', usermiddleware, couponDetails)
router.post('/setcoupon', usermiddleware, setCoupon)

router.get('/profile', usermiddleware, profile)
router.post('/profile', usermiddleware, editProfile)
// router.post('/profile/edit_profile', usermiddleware, )

router.get('/orders', usermiddleware, orders)
router.post('/orders/setpayment', usermiddleware, setPayment)
router.post('/orders/place_order', usermiddleware, placeOrder)
router.post('/orders/view_order', usermiddleware, viewOrder)
router.post('/orders/cancel_order', usermiddleware, removeOrder)
router.post('/orders/return_order', usermiddleware, returnOrder)
router.get('/orders/invoice', usermiddleware, invoice)

router.post('/setprice', usermiddleware, setPrice)

router.get('/address', usermiddleware, address)
router.post('/address/add_address', usermiddleware, addAddress)
router.post('/address/add_address/checkout', usermiddleware, setToCheckout)
router.get('/address/delete_address', usermiddleware, removeAddress)
router.get('/address/edit_address', usermiddleware, editAddress)
router.post('/address/edit_address', usermiddleware, editAddress)

router.get('/:id', usermiddleware, productLoad)

module.exports = router