const usrmodel = require('../../models/userModel')
const couponmodel = require('../../models/couponModel')
const {itemmodel} = require('../../models/productsModel')
const mainpay = require('../../controllers/other/dashboardObj')
const userModel = require('../../models/userModel')
const { mainList } = require('../user/checkoutController')
const { couponApply } = require('../user/orderController')

module.exports.applyCoupon = async(req, res) => {
    try {        
        const data = []
        const list = []
        const coupondata = []
        let maincoupon = null
        let message = ''
        
        const user = await usrmodel.findOne({name: req.session.username})
    
        for(let i of user.cart) {
            const products = await itemmodel.findOne({_id: i.item})
            data.push([i.count, products])
        }
        
        for(let i of data) {
            let dat = {}
            
            dat.count = i[0]
            dat.name = i[1].name
            dat.price = i[1].price

            list.push(dat)
        }
        
        if(req.body.couponCode) {
            for(let i of user.coupons) {
                const coupon = await couponmodel.findOne({_id: i})
                if(coupon.code === req.body.couponCode) {
                    maincoupon = coupon
                }
            }
        }

        if(maincoupon !== null) {
            if(maincoupon.products[0] !== 'all') {
                for(let i of list) {
                    if(i.count * i.price > maincoupon.value) {
                        message = 'proceed'
                    } else {
                        message = 'higher_price'
                    }
                }
            } else {
                message = 'all'
            }
        } else {
            message = false
        }
        
        res.json({message: message})

        console.log(message)

        // res.render('pages/home', 
        // {
        //     user: req.session.username, page: 'checkout',
        //     address: user.address, data: list,
        //     couponMessage: message, couponCode: req.body.couponCode,
        //     coupondata: coupondata, type: 'COD'
        // })

        // if(coupon.code === req.body.couponCode) {
        //     console.log(coupon.code)
        //     // coupondata.push(coupon.Purchase, ...coupon.value)
        //     res.render('pages/home', 
        //     {
        //         user: req.session.username, page: 'checkout',
        //         address: user.address, data: list,
        //         couponMessage: true, couponCode: req.body.couponCode,
        //         coupondata: coupondata, type: 'COD'
        //     })
        //     return
        // } else {
        //     res.render('pages/home', 
        //     {
        //         user: req.session.username, page: 'checkout',
        //         address: user.address, data: list,
        //         couponMessage: true, couponCode: 'wrong',
        //         coupondata: null, type: 'COD'
        //     })
        //     return
        // }
    } catch (error) {
        console.log(error.message, 'is dis')
    }
}

module.exports.fetchCooupon = async(req, res) => {
    try {
        const list = []
        const data = []

        const getCoupon = await couponmodel.findOne({code: req.body.coupon})
        const user = await usrmodel.findOne({name: req.session.username})
        
        for(let i of user.cart) {
            const products = await itemmodel.findOne({_id: i.item})
            data.push([i.count, products])
        }
        
        for(let i of data) {
            let dat = {}
            
            dat.count = i[0]
            dat.name = i[1].name
            dat.price = i[1].price

            list.push(dat)
        }

        res.json({message: getCoupon, data: list})
    } catch (error) {
        console.log(error.message)
    }
}

module.exports.setCoupon = (req, res) => {
    couponApply.push(req.body.coupon)
    couponApply.push(req.body.price)
    // console.log(couponApply)
}

module.exports.couponDetails = async(req, res) => {
    const getCoupon = await couponmodel.findOne({name: req.body.coupon})
    if(getCoupon !== null) {
        res.json({code: getCoupon.code})
    } 
}