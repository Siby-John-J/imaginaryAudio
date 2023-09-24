const { Router } = require('express')
const { adminLogin, adminAuth, adminLogout, insertPassword } = require('../controllers/admin/adminLoginController')
const { category, setCategory, blockCategory, editCategory, showEdit } = require('../controllers/admin/adminPageController')
const { deleteProduct, addProduct, products, authProduct, editProduct, editProductAuth, traverse } = require('../controllers/admin/productController')
const { customers, userBlock } = require('../controllers/admin/userController')
const { orders, editOrder, cancelOrder } = require('../controllers/admin/orderController')
const { couponList, couponCreate, couponPurchase, couponSet, sendCoupon, setCoupon } = require('../controllers/admin/couponController')

const { adminLoginMiddleware, adminAccessMiddleware } = require('../middlewares/adminMiddleware')
const errormiddleware = require('../middlewares/errorMiddleware')
const imageMiddleware = require('../middlewares/multer')    
const { viewReport, filterReport, printReport } = require('../controllers/admin/reportController')
const { dashboard, dashboardData } = require('../controllers/admin/dashboardController')
const { viewBanner, setBanner, selectBanner, deleteBanner } = require('../controllers/admin/bannerController')

const router = Router()

router.get('/login', adminLoginMiddleware, adminLogin)
router.get('/logout', adminLogout)

// router.get('/deleteandupdate', insertPassword)

router.post('/auth', adminLoginMiddleware, adminAuth)

router.get('/dashboard', adminAccessMiddleware, dashboard)
router.get('/dashboard_data', adminAccessMiddleware, dashboardData)

router.post('/setcat', imageMiddleware.single('img'), setCategory)
router.get('/showedit', showEdit)
router.post('/editcat', imageMiddleware.single('img'), editCategory)

router.get('/products', adminAccessMiddleware, products)
router.get('/addproduct', addProduct)
router.post('/authproduct', imageMiddleware.array('image'), authProduct)
router.get('/editproduct', editProduct)
router.post('/modifyproduct', imageMiddleware.array('image'), editProductAuth)

router.get('/products/traverse', adminAccessMiddleware, traverse)
router.post('/products/traverse', adminAccessMiddleware, traverse)

router.get('/deleteproduct', deleteProduct)
router.post('/products', products)

router.get('/category', adminAccessMiddleware, category)
router.post('/category/add', adminAccessMiddleware)
router.get('/category/block', blockCategory)

router.get('/customers', adminAccessMiddleware, customers)
router.get('/customers/block', userBlock)

router.get('/orders', adminAccessMiddleware, orders)
router.post('/orders/edit_order', adminAccessMiddleware, editOrder)
router.post('/orders/cancel_order', adminAccessMiddleware, cancelOrder)
// router.get('/orders/edit_order', adminAccessMiddleware, editOrder)

router.get('/report', adminAccessMiddleware, viewReport)
router.post('/report/filter', adminAccessMiddleware, filterReport)
router.get('/report/print', adminAccessMiddleware, printReport)

router.get('/banner', adminAccessMiddleware, viewBanner)
router.post('/banner/set', imageMiddleware.single('img'), setBanner)
router.post('/banner/select', adminAccessMiddleware, selectBanner)
router.post('/banner/delete', adminAccessMiddleware, deleteBanner)

router.get('/coupon/list', adminAccessMiddleware, couponList)
router.get('/coupon/create', adminAccessMiddleware, couponCreate)
router.get('/coupon/create/select', adminAccessMiddleware, couponCreate)
router.post('/coupon/create/action', adminAccessMiddleware, couponCreate)
router.post('/coupon/create/set', adminAccessMiddleware, couponSet)

router.get('/coupon/purchase', adminAccessMiddleware, couponPurchase)

router.post('/coupon/set', adminAccessMiddleware, setCoupon)
router.post('/coupon/send', adminAccessMiddleware, sendCoupon)

router.get('/:id', (req, res) => {
    res.render('pages/404')
})

module.exports = router