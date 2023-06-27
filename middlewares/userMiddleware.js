module.exports = userMiddleware = (req, res, next) => {
    res.setHeader('Cache-Control', 'no-store')
    res.setHeader('Pragma', 'no-cache')
    res.setHeader('Expires', '0')

    console.log('yeah user')
    
    next()
}