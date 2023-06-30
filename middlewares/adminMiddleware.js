
module.exports.adminLoginMiddleware = (req, res, next) => {
    res.setHeader('Cache-Control', 'no-store')
    res.setHeader('Pragma', 'no-cache')
    res.setHeader('Expires', '0')
    
    if(req.session.isAdminLogin) {
        res.redirect('/admin/dashboard')
    } else {
        next()
    }
}

module.exports.adminAccessMiddleware = (req, res, next) => {
    res.setHeader('Cache-Control', 'no-store')
    res.setHeader('Pragma', 'no-cache')
    res.setHeader('Expires', '0')

    if(req.session.isAdminLogin) {
        next()
    } else {
        res.redirect('/admin/login')
    }
}