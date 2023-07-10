const { Router } = require('express')
const { adminLogin, adminAuth, adminLogout, insertPassword } = require('../controllers/admin/adminLoginController')
const { dashboard, category, setCategory, blockCategory } = require('../controllers/admin/adminPageController')
const { deleteProduct, addProduct, products, authProduct, editProduct, editProductAuth } = require('../controllers/admin/productController')
const { customers, userBlock } = require('../controllers/admin/userController')
const { orders, editOrder } = require('../controllers/admin/orderController')

const { adminLoginMiddleware, adminAccessMiddleware } = require('../middlewares/adminMiddleware')
const errormiddleware = require('../middlewares/errorMiddleware')
const imageMiddleware = require('../middlewares/multer')

const router = Router()

router.get('/login', adminLoginMiddleware, adminLogin)
router.get('/logout', adminLogout)

// router.get('/deleteandupdate', insertPassword)

router.post('/auth', adminLoginMiddleware, adminAuth)

router.get('/dashboard', adminAccessMiddleware, dashboard)

router.post('/setcat', adminAccessMiddleware, setCategory)

router.get('/products', adminAccessMiddleware, products)
router.get('/addproduct', addProduct)
router.post('/authproduct', imageMiddleware.array('image'), authProduct)
router.get('/editproduct', editProduct)
router.post('/modifyproduct', imageMiddleware.array('image'), editProductAuth)

router.post('/deleteproduct', deleteProduct)
router.post('/products', products)

router.get('/category', adminAccessMiddleware ,category)
router.get('/category/block', blockCategory)

router.get('/customers', adminAccessMiddleware, customers)
router.get('/customers/block', userBlock)

router.get('/orders', adminAccessMiddleware, orders)
router.post('/orders/edit_order', adminAccessMiddleware, editOrder)

module.exports = router