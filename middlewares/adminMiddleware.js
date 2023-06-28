
module.exports = adminMiddleware = (req, res, next) => {
    res.setHeader('Cache-Control', 'no-store')
    res.setHeader('Pragma', 'no-cache')
    res.setHeader('Expires', '0')
    
    // console.log(req.session.isAdminLogin, 'middleware')
    
    next()
}
