const usermodel = require('../models/userModel')

let count = 0
let count2 = 0

module.exports = userMiddleware = async(req, res, next) => {
    res.setHeader('Cache-Control', 'no-store')
    res.setHeader('Pragma', 'no-cache')
    res.setHeader('Expires', '0')

    const user = await usermodel.findOne({name: req.session.username})
    
    if(user !== null) {
        if(user.status === false) {
            res.render('pages/login', {type: 'email'})
            return
        } else {
            next()
        }
    } else {
        res.render('pages/login', {type: 'email'})
    }
}
