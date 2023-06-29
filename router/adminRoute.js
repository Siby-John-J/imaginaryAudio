const { Router } = require('express')
const { adminLogin, adminAuth, adminLogout } = require('../controllers/admin/adminLoginController')
const { dashboard, category, setCategory, blockCategory } = require('../controllers/admin/adminPageController')
const { deleteProduct, addProduct, products, authProduct, editProduct, editProductAuth } = require('../controllers/admin/productController')
const { customers, userBlock } = require('../controllers/admin/userController')

const adminmiddlware = require('../middlewares/adminMiddleware')

const router = Router()

router.get('/login', adminmiddlware, adminLogin)
router.get('/logout', adminmiddlware, adminLogout)

router.post('/auth', adminmiddlware, adminAuth)

router.get('/dashboard', adminmiddlware, dashboard)

router.post('/setcat', setCategory)

router.get('/products', adminmiddlware, products)
router.get('/addproduct', addProduct)
router.post('/authproduct', authProduct)
router.get('/editproduct', editProduct)
router.post('/modifyproduct', editProductAuth)

router.post('/deleteproduct', deleteProduct)
router.post('/products', products)

router.get('/category', adminmiddlware, category)
router.get('/category/block', blockCategory)

router.get('/customers', adminmiddlware, customers)
router.get('/customers/block', userBlock)

module.exports = router