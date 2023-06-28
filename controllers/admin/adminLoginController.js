// const adminmiddlware = require('../../middlewares/adminMiddleware')
const adminLoginModel = require('../../models/adminModel')

module.exports.adminLogin = (req, res) => {
    if(req.session.isAdminLogin === false || req.session.isAdminLogin === undefined) {
        // res.render('login')
        res.render('pages/admin/adminLogin')
    } else {
        res.redirect('/admin/dashboard')
    }
}

module.exports.adminAuth = (req, res) => {
    console.log(req.session.isAdminLogin, 'auth')
    adminLoginModel.findOne({
        email: req.body.email,
        password: req.body.password
    }).then(data => {
        if(data !== null) {
            req.session.isAdminLogin = true
            res.redirect('/admin/dashboard')
        } else {
            res.redirect('/admin/login') 
        }
    })
}

module.exports.adminLogout = (req, res) => {
    req.session.isAdminLogin = false
    res.redirect('/admin/login')
}
