

const usermodel = require('../../models/userModel')
const couponmodel = require('../../models/couponModel')
const { itemmodel } = require('../../models/productsModel')
const { couponApply } = require('../user/orderController')

const mainpay = require('../../controllers/other/dashboardObj')

module.exports.mainList = []

module.exports.checkout = async(req, res) => {
    this.mainList = []
    // couponApply.pop()
    const data = []
    const list = []
    const coupondata = []
    let mainpayment = ''
    
    try {
        const user = await usermodel.findOne({name: req.session.username})
    
        for(let i of user.cart) {
            const products = await itemmodel.findOne({_id: i.item})
            if(products !== null) {
                data.push([i.count, products])
                // console.log(products.stock, i.count)
                if(products.stock < i.count) {
                    res.redirect('/' + req.session.username + '/cart?mess=outOfStock')
                } else {
                    // const update = await itemmodel.updateOne(
                    //     { name: req.query.name },
                    //     { $inc: { stock: -1 } }
                    // )
                }
            }
        }
    
        for(let i of data) {
            let dat = {}
    
            dat.count = i[0]
            if(i[1] !== null) {
                dat.name = i[1].name
                dat.price = i[1].price
            }
            list.push(dat)
        }

        
        this.mainList.push(...list)
        // console.log(list)
        // console.log(this.mainList)
        if(req.body.couponCode) {
            for(let i of user.coupons) {
                const coupon = await couponmodel.findOne({_id: i})
                if(coupon.code === req.body.couponCode) {
                    coupondata.push(coupon.Purchase, ...coupon.value)
                    
                    res.render('pages/home',
                    {
                        user: req.session.username, page: 'checkout',
                        address: user.address, data: list,
                        couponMessage: true, couponCode: req.body.couponCode,
                        coupondata: coupondata
                    })
                } else {
                    res.render('pages/home', 
                    {
                        user: req.session.username, page: 'checkout',
                        address: user.address, data: list,
                        couponMessage: true, couponCode: 'wrong',
                        coupondata: null
                    })
                }
            }
        } else {
            if(req.query.type === 'Razorpay') {
                if(req.body.message === 'success') {
                    res.send('success')
                    // res.render('pages/home', {user: req.session.username, page: 'success'})
                } else {
                    res.render('pages/home', 
                    {
                        user: req.session.username, page: 'checkout',
                        address: user.address, data: list,
                        couponMessage: false, couponCode: '',
                        coupondata: '', type: 'Razorpay'
                    })
                }
            } else {
                if(req.body.message === 'success') {
                    res.send('success')
                    // res.render('pages/home', {user: req.session.username, page: 'success'})
                } else {
                    const all_address = [...user.address]
                    this.globalAddress.push(...user.address)
                    
                    const coupons = await usermodel.findOne(
                        { name: req.session.username },
                    )
                    
                    coupons.coupons.map(item => {
                        couponmodel.findOne({_id: item}).then(data => {
                            coupondata.push(data.name)
                        })
                    })
                    
                    console.log(this.globalAddress.length)
                    console.log(all_address.length)

                    setTimeout(() => {
                        res.render('pages/home', 
                        {
                            user: req.session.username, page: 'checkout',
                            address: user.address, data: list,
                            couponMessage: false, couponCode: '',
                            coupondata: coupondata, type: 'COD'
                        })
                    }, 500)
                }
            }
        }
    } catch (error) {
        console.log(error.message)
    }
}

module.exports.globalAddress = []