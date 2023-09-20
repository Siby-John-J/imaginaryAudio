
const couponModel = require('../../models/couponModel')
const usermodel = require('../../models/userModel')

module.exports.wallet = async(req, res) => {
    let coupons = []

    let data = await usermodel.findOne({name: req.session.username}, {coupons: 1})

    for(let i of data.coupons) {
        let coupon = await couponModel.findOne({_id: i})
        coupons.push(coupon)
    }

    res.render('pages/home', {page: 'wallet', user: req.session.username, coupon: coupons})
}

module.exports.card = async(req, res) => {
    let coupons = []
    let data = await usermodel.findOne({name: req.session.username})

    for(let i of data.coupons) {
        let coupon = await couponModel.findOne({_id: i})
        coupons.push(coupon)
    }

    res.render('pages/user/profile/mainPage', {page: 'wallet', 
    user: req.session.username, data: data, coupons: coupons})
}
