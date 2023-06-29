
module.exports = errorMiddleware = (err, req, res, next) => {
    if(err.status === 'unknown files') {
        // console.log(err.status, err.statusCode)
        res.redirect('/admin/addproduct')
    } else {
        next()
    }
}
