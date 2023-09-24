
const { categorymodel, itemmodel } = require('../../models/productsModel')
const couponmodel = require('../../models/couponModel')
const usermodel = require('../../models/userModel')

let item = []
let coupons = []
let id = ''

module.exports.couponList = async(req, res) => {
    let data = await couponmodel.find({})
    let users = await usermodel.find({}, {name: 1})
    let listcate = await categorymodel.find({}, {name: 1, _id: 0})

    let products = []

    for(let i of listcate) {
        let item = await itemmodel.find({category: i.name}, {name: 1})
        let cat = i.name
        let prod = []
        for(let j of item) {    
            prod.push(j.name)
        }
        products.push({[cat]: prod})
    }

    if(req.query.id) {
        id = req.query.id
    }
    
    console.log(data)
    console.log(req.query)
    console.log(users)
    console.log(products)

    res.render('pages/admin/mainPage', {page: 'coupon', cPage: 'list-coupon', 
    data: data, type: req.query.type, users: users, products: products})
}

module.exports.couponPurchase = async(req, res) => {
    let data = await usermodel.find({}, {name: 1})

    res.render('pages/admin/mainPage', {data: data, page: 'coupon', cPage: 'purchase-coupon'})
}

module.exports.couponCreate = async(req, res) => {
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
    
    let discount = Number(req.body.amount)
    let position = ''
    let color = ''


    if(req.body.coupon_type === 'amount') {
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
    } else if(req.body.coupon_type === 'percentage') {
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
        const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
        let couponCode = ""
        
        for (let i = 0; i < length; i++) {
          const randomIndex = Math.floor(Math.random() * charset.length)
          couponCode += charset[randomIndex]
        }
        
        return couponCode
    }

    function convertToTime(inputValue) {
        // Parse the input value into hours, minutes, and seconds
        const hours = parseInt(inputValue.substr(0, 2), 10);
        const minutes = parseInt(inputValue.substr(2, 2), 10);
        const seconds = parseInt(inputValue.substr(4, 2), 10);
      
        // Format each component to have two digits
        const formattedHours = hours.toString().padStart(2, '0');
        const formattedMinutes = minutes.toString().padStart(2, '0');
        const formattedSeconds = seconds.toString().padStart(2, '0');
      
        // Concatenate the components to get the final time string
        const timeString = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
        return timeString;
      }
      
    const timeInString = convertToTime(req.body.time_limit)
    
    let item = req.body.items ? req.body.items : 'all'
    
    const model = await couponmodel.insertMany([{
        name: req.body.coupon_name,
        code: generateCouponCode(8),
        type: req.body.coupon_type,
        value: Number(req.body.min_purchase),
        Purchase: Number(req.body.amount),
        limit: timeInString,
        products: item,
        position: position,
        color: color
    }])

    res.redirect('/admin/coupon/list')
}

module.exports.setCoupon = async(req, res) => {
    coupons = []

    if(typeof req.body.selected === 'string') {
        coupons.push(req.body.selected)
    } else {
        coupons.push(...req.body.selected)
    }

    let model = await usermodel.updateOne(
        {_id: id},
        { $push: { coupons: { $each: coupons } } }
    )
    
    res.redirect('/admin/coupon/list')
}

module.exports.sendCoupon = async(req, res) => {
    // let model = await usermodel.updateOne(
    //     {_id: id},
    //     { $push: { coupons: [...coupons] } }
    // )

    // for(let i of coupons) {
    //     let couponmd = await couponmodel.deleteOne({_id: i})
    // }
    
    res.redirect('/admin/coupon/list')
}
