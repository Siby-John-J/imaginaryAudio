
let isadminlogin = null

module.exports = {
    adminMiddleware : (req, res, next) => {
    res.setHeader('Cache-Control', 'no-store')
    res.setHeader('Pragma', 'no-cache')
    res.setHeader('Expires', '0')

    isadminlogin = req.session.isAdminLogin

    // console.log('middleware called pulle..', isadminlogin)
    next()
    },
    isadminlogin: isadminlogin
}
