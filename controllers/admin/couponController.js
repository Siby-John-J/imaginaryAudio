
const { categorymodel, itemmodel } = require('../../models/productsModel')
const couponmodel = require('../../models/couponModel')
const usermodel = require('../../models/userModel')

let item = []
let coupons = []
let id = ''

module.exports.couponList = async(req, res) => {
    let data = await couponmodel.find({})

    if(req.query.id) {
        id = req.query.id
    }

    res.render('pages/admin/mainPage', {page: 'coupon', cPage: 'list-coupon', 
    data: data, type: req.query.type})
}

module.exports.couponPurchase = async(req, res) => {
    let data = await usermodel.find({}, {name: 1})

    res.render('pages/admin/mainPage', {data: data, page: 'coupon', cPage: 'purchase-coupon'})
}

module.exports.couponCreate = async(req, res) => {
    let listcate = await categorymodel.find({}, {name: 1, _id: 0})

    if(req.query.name) {
        let listname = await itemmodel.find({category: req.query.name}, {name: 1, _id: 1})
        res.render('pages/admin/mainPage', {page: 'coupon', cPage: 'create-coupon',
        data: listname, qname: req.query.name, fielddata: ''})
    } else if(req.query.select) {
        res.redirect('/admin/coupon/create')
    } else if(req.body.addto) {
        item.push(...req.body.addto)
        res.render('pages/admin/mainPage', {page: 'coupon', cPage: 'create-coupon',
        data: listcate, qname: '', fielddata: item})
    } else if(req.query.type) {
        if(req.query.type === 'cancel') {
            item = []
            res.redirect('/admin/coupon/create')
        }
    } else {
        res.render('pages/admin/mainPage', {page: 'coupon', cPage: 'create-coupon',
        data: listcate, qname: '', fielddata: ''})
    }
}

module.exports.couponSet = async(req, res) => {
    
    let discount = Number(req.body.discountValue)
    let position = ''
    let color = ''

    if(req.body.discountVal === 'amount') {
        if(discount <= 100) {
            position = 'low'
            color = 'linear-gradient(358deg, black, transparent);'
        } else if(discount >= 100 && discount <= 300) {
            position = 'lowMid'
            color = '#3ac669'
        } else if(discount > 300 && discount <= 700) {
            position = 'mid'
            color = 'linear-gradient(16deg, #0012ff, #00d0ff);'
        } else if(discount > 700 && discount <= 2500) {
            position = 'highMid'
            color = 'linear-gradient(16deg, #ff00d9, #8300ff);'
        } else if(discount > 2500 && discount <= 7000) {
            position = 'high'
            color = 'linear-gradient(0deg, #ff7c00, #fdff00);'
        } else if(discount > 7000) {
            position = 'highest'
            color = 'linear-gradient(0deg, #0800ff, #12ff00);'
        }
    } else if(req.body.discountVal === 'percentage') {
        if(discount <= 5) {
            position = 'low'
            color = 'linear-gradient(358deg, black, transparent);'
        } else if(discount > 5 && discount <= 10) {
            position = 'lowMid'
            color = '#3ac669'
        } else if(discount > 10 && discount <= 20) {
            position = 'mid'
            color = 'linear-gradient(16deg, #0012ff, #00d0ff);'
        } else if(discount > 20 && discount <= 35) {
            position = 'highMid'
            color = 'linear-gradient(16deg, #ff00d9, #8300ff);'
        } else if(discount > 35 && discount <= 50) {
            position = 'high'
            color = 'linear-gradient(0deg, #ff0000, #ff00db);'
        } else if(discount > 50 && discount <= 70) {
            position = 'highest'
            color = 'linear-gradient(0deg, #ff7c00, #fdff00);'
        } else if(discount > 70 && discount <= 90) {
            position = 'most'
            color = 'linear-gradient(0deg, #0800ff, #12ff00);'
        }
    }

    function generateCouponCode(length) {
        const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let couponCode = "";
        
        for (let i = 0; i < length; i++) {
          const randomIndex = Math.floor(Math.random() * charset.length);
          couponCode += charset[randomIndex];
        }
        
        return couponCode;
    }
    
    let model = await couponmodel.insertMany([{
        name: req.body.couponName,
        code: generateCouponCode(8),
        type: req.body.discountType,
        value: [req.body.discountVal, Number(req.body.discountValue)],
        Purchase: Number(req.body.minimum),
        limit: [req.body.limit, req.body.limitNumber],
        products: item,
        position: position,
        color: color
    }])

    res.redirect('/admin/coupon/list')
}

module.exports.setCoupon = (req, res) => {
    coupons = []

    if(typeof req.body.selected === 'string') {
        coupons = [req.body.selected]
    } else {
        coupons = [...req.body.selected]
    }

    res.redirect('/admin/coupon/purchase')
}

module.exports.sendCoupon = async(req, res) => {
    let model = await usermodel.updateOne(
        {_id: id},
        { $push: { coupons: [...coupons] } }
    )
    
    // for(let i of coupons) {
    //     let couponmd = await couponmodel.deleteOne({_id: i})
    // }
    
    res.redirect('/admin/coupon/purchase')
}
