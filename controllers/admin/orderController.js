const ordermodel = require('../../models/ordersModel')
const usermodel = require('../../models/userModel')
const reportmodel = require('../../models/salesModel')
const { itemmodel } = require('../../models/productsModel')
const { salesCountModel } = require('../../models/dashboardModel')

const { globalAddress } = require("../user/checkoutController")

let status = ''
let salesNum = 1

function getIndianTime(date) {
    const currentOffset = date.getTimezoneOffset()
    const indianOffset = -(6 * 60 + 30)
    const indianTime = date.getTime() - (currentOffset - indianOffset) * 60 * 1000
    const indianDate = new Date(indianTime)
    
    return indianDate
}

function date() {
    const currentDate = new Date()
    const indianTime = getIndianTime(currentDate)

    let Year = ''
    let Time = ''
    
    const year = indianTime.getFullYear()
    const month = String(indianTime.getMonth() + 1).padStart(2, '0')
    const day = String(indianTime.getDate()).padStart(2, '0')
    const hours = String(indianTime.getHours()).padStart(2, '0')
    const minutes = String(indianTime.getMinutes()).padStart(2, '0')
    const seconds = String(indianTime.getSeconds()).padStart(2, '0')

    Year = `${year}-${month}-${day}`
    Time = `${hours}:${minutes}:${seconds}`
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}


module.exports.orders = async(req, res) => {
    try {        
        const data = []
    
        const orders = await ordermodel.find().sort({_id: -1})
        for(let i of orders) {
            let user = await usermodel.findOne({ _id: i.userid })
            let prod = []
            
            for(let j of i.order) {
                let product = await itemmodel.findOne(
                    { _id: j.item },
                    {_id: 0, name: 1}
                )
    
                if(product !== null) {
                    prod.push(product.name)
                }
    
            }

            if(user !== null) {
                data.push({
                    orderid: i.orderid,
                    products: prod,
                    user: user.name,
                    price: i.totalprice,
                    status: i.status,
                    payment: i.payment,
                })
            }
        }
        res.render('pages/admin/mainPage', {page: 'orders', data: data})
    } catch (error) {
        console.log(error.message)
    }
}

module.exports.editOrder = async(req, res) => {
    const report = {}
    const products = []

    if(req.body.status === 'pending') {
        status = 'processing'
        const order = await ordermodel.updateOne(
            {orderid: req.body.orderid},
            { $set: { status: status } }
        )
    } else if(req.body.status === 'processing') {
        status = 'delivered'
        const order = await ordermodel.updateOne(
            {orderid: req.body.orderid},
            { $set: { status: status } }
        )
    }

    if(status === 'delivered') {
        const sales = await ordermodel.findOne({orderid: req.body.orderid})
        // const formattedDate = date()

        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`

        for(let item of sales.order) {
            const product = await itemmodel.findOne({_id: item.item})
            // console.log(product)
            if(product !== null) {
                products.push({name: product.name, count: item.count})
            }
        }
        
        const add_report = await reportmodel.insertMany([{
            orderid: sales.orderid,
            user: sales.firstname + ' ' + sales.lastname,
            date: formattedDate,
            phone: sales.phone,
            address: sales.address + ' ' + sales.town,
            total: sales.totalprice,
            payment: sales.payment,
            products: products
        }])

        const findsales = await salesCountModel.find({})
        
        if(findsales.length <= 0) {
            const insertfirst = await salesCountModel.insertMany([
                { sales: 1, return: 0, date: formattedDate, order: salesNum }
            ])
            salesNum++
        } else {
            const finddate = await salesCountModel.find({})

            const inputString = finddate[finddate.length - 1].date
            const regexPattern = /(\d{4})-(\d{1,2})-(\d{1,2})/
            // const regexDay = /(\d{2})-(\d{2})-(\d{2})/

            const matchdb = regexPattern.exec(inputString)
            const matchcurrent = regexPattern.exec(formattedDate)

            if (matchdb) {
                if(Number(matchcurrent[2] > matchdb[2])) {              
                    const insertfirst = await salesCountModel.insertMany([
                        { sales: 1, return: 0, date: formattedDate, order: salesNum }
                    ])
                    salesNum++
                } else {
                    const insertfirst = await salesCountModel.findOneAndUpdate(
                        { order: [salesNum - 1] },
                        { $inc: { sales: 1 } }
                    )
                }
            }
        }
    }
    
    res.redirect('/admin/orders')
}

module.exports.cancelOrder = async(req, res) => {
    const findorder = await ordermodel.findOne({orderid: req.body.orderid})

    if(findorder.status === 'delivered') {
        console.log('cannot cancel the deliverd item')
    } else {
        const order = await ordermodel.updateOne(
            { orderid: req.body.orderid },
            { $set: { status: 'cancel' } }
        )
        
        const findit = await ordermodel.findOne({orderid: req.body.orderid})
        
        if(findit.payment === 'razorpay') {
            const userfind = await usermodel.updateOne(
                {_id: findit.userid},
                { $inc: { wallet: findit.totalprice } }
            )
        }
    }

    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    const findsales = await salesCountModel.find({})
    
    if(findsales.length <= 0) {
        const insertfirst = await salesCountModel.insertMany([
            { sales: 0, return: 1, date: formattedDate, order: salesNum }
        ])
        salesNum++
    } else {
        const finddate = await salesCountModel.find({})

        const inputString = finddate[finddate.length - 1].date
        const regexPattern = /(\d{4})-(\d{1,2})-(\d{1,2})/

        const matchdb = regexPattern.exec(inputString)
        const matchcurrent = regexPattern.exec(formattedDate)

        console.log(matchdb, matchcurrent)
        
        if (matchdb) {
            if(Number(matchcurrent[2] > matchdb[2])) {              
                const insertfirst = await salesCountModel.insertMany([
                    { sales: 0, return: 1, date: formattedDate, order: salesNum }
                ])
                salesNum++
            } else {
                const insertfirst = await salesCountModel.findOneAndUpdate(
                    { order: [salesNum - 1] },
                    { $inc: { return: 1 } }
                )
            }
        }
    }
    
    res.redirect('/admin/orders')
}

module.exports.setToCheckout = async(req, res) => {

    try {        
        const address = await usermodel.findOneAndUpdate(
            { name: req.session.username },
            { $push : { address: {
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.c_email_address,
                phone: Number(req.body.phone),
                address: req.body.address,
                town: req.body.town,
                region: req.body.region,
                zip: Number(req.body.zip)
            } } }
        )
    
        res.redirect('/' + req.session.username + '/checkout')
    } catch (error) {
        
    }

}