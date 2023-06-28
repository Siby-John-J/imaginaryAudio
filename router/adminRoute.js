const { Router } = require('express')
const { adminLogin, adminAuth, adminLogout } = require('../controllers/admin/adminLoginController')
const { dashboard, customers, category, setCategory } = require('../controllers/admin/adminPageController')
const { deleteProduct, addProduct, products, authProduct } = require('../controllers/admin/productController')
// const dashboardRoute = require('./dashboardRoute')
const router = Router()

router.get('/login', adminLogin)
router.post('/auth', adminAuth)

router.get('/dashboard', dashboard)
router.get('/customers', customers)


router.get('/category', category)

router.get('/logout', adminLogout)

router.post('/setcat', setCategory)

router.get('/products', products)
router.get('/addproduct', addProduct)
router.post('/authproduct', authProduct)
router.post('/deleteproduct', deleteProduct)
router.post('/products', products)

module.exports = router