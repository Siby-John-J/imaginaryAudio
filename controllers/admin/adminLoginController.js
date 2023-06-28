// const adminmiddlware = require('../../middlewares/adminMiddleware')
const adminLoginModel = require('../../models/adminModel')

module.exports.adminLogin = (req, res) => {
    if(req.session.isAdminLogin) {
        res.redirect('/admin/dashboard')
    } else {
        res.render('pages/admin/adminLogin')
    }
}

module.exports.adminAuth = (req, res) => {
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
