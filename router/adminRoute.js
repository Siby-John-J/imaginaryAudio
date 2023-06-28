const { Router } = require('express')
const { adminLogin, adminAuth, adminLogout } = require('../controllers/admin/adminLoginController')
const { dashboard, customers, category, setCategory } = require('../controllers/admin/adminPageController')
const { deleteProduct, addProduct, products, authProduct } = require('../controllers/admin/productController')

const adminmiddlware = require('../middlewares/adminMiddleware')

const router = Router()

router.get('/login', adminmiddlware, adminLogin)

router.post('/auth', adminmiddlware, adminAuth)

router.get('/dashboard', adminmiddlware, dashboard)
router.get('/customers', adminmiddlware, customers)
router.get('/category', adminmiddlware, category)

router.get('/logout', adminLogout)

router.post('/setcat', setCategory)

router.get('/products', adminmiddlware, products)
router.get('/addproduct', addProduct)
router.post('/authproduct', authProduct)
router.post('/deleteproduct', deleteProduct)
router.post('/products', products)

module.exports = router