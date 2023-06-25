const { Router } = require('express')
const { adminLogin, adminAuth, adminLogout } = require('../controllers/admin/adminLoginController')
const { dashboard, customers, products, category, addProduct, authProduct, setCategory } = require('../controllers/admin/adminPageController')
const { deleteProduct } = require('../controllers/admin/productController')
// const dashboardRoute = require('./dashboardRoute')
const router = Router()

// function adminMiddleware(req, res, next) {
//     res.setHeader('Cache-Control', 'no-store')
//     res.setHeader('Pragma', 'no-cache')
//     res.setHeader('Expires', '0')

//     console.log('middleware called...', req.session.isadminLogin)
//     next()
// }
// router.use(adminMiddleware)

router.get('/login', adminLogin)
router.post('/auth', adminAuth)

router.get('/dashboard', dashboard)
router.get('/customers', customers)
router.get('/products', products)
router.get('/addproduct', addProduct)
router.get('/category', category)
router.get('/logout', adminLogout)

router.post('/setcat', setCategory)
router.post('/authproduct', authProduct)

router.post('/products', products)

router.post('/deleteproduct', deleteProduct)

module.exports = router