
const Razorpay = require('razorpay')
const PDFDocument = require('pdfkit')
const fs = require('fs')

const usermodel = require('../../models/userModel')
const ordermodel = require('../../models/ordersModel')
const { itemmodel } = require('../../models/productsModel')
const { salesCountModel } = require('../../models/dashboardModel')

const mainpay = require('../../controllers/other/dashboardObj')
const { ObjectId } = require('mongodb')

require('dotenv').config()
const { RAZORPAY_ID_KEY, RAZORPAY_SECRET_KEY } = process.env

let address = null
let main_payment = 'COD'
let salesNum = 1

const instance = new Razorpay({ 
    key_id: RAZORPAY_ID_KEY, 
    key_secret: RAZORPAY_SECRET_KEY
})

async function getOrderDetails(username, orderid='') {
    try {
        const data = []
        
        const user = await usermodel.findOne({name: username})
        const cart = await ordermodel.find( { userid: user._id } ).sort({_id: -1})
    
        if(cart) {
            if(orderid !== '') {
                let i = await ordermodel.findOne( { _id: orderid } )
                
                let prod = []
                
                for(let j of i.order) {
                    let product = await itemmodel.findOne(
                        { _id: j.item }
                    )
                    prod.push({
                        name: product.name,
                        cate: product.category,
                        img: product.image[0],
                        price: product.price,
                        quan: j.count
                    })
                }
    
                data.push({
                    mainid: i._id,
                    details: prod,
                    orderid: i.orderid,
                    status: i.status,
                    price: i.totalprice,
                    payment: i.payment,
                    purchase: '09/11/2000',
                    arriving: '19/12/2032',
                    address: i.address
                })
                
                return data
            } else {
                for(let i of cart) {
                    let prod = []
                    
                    for(let j of i.order) {
                        let product = await itemmodel.findOne(
                            { _id: j.item }
                        )
                        if(product !== null) {
                            prod.push({
                                name: product.name,
                                img: product.image[0]
                            })
                        }
                    }
                    
                    data.push({
                        mainid: i._id,
                        details: prod,
                        orderid: i.orderid,
                        status: i.status,
                        price: i.totalprice,
                        payment: i.payment,
                        purchase: '09/11/2000',
                        arriving: '19/12/2032',
                        address: i.address
                    })
                    
                }
            }
        }
    
        return [data, user]
        
    } catch (error) {
        
    }
}

module.exports.couponApply = []

module.exports.mainPrice = 0

module.exports.orders = async(req, res) => {
    const data = await getOrderDetails(req.session.username)
    const orderid = []

    for(let i of data[0]) {
        orderid.push(i.orderid)
    }

    res.render('pages/user/profile/mainPage', {page: 'orders',
    data: data[1], user: req.session.username, cart: data[0],
    items: '', address: ''})
}

module.exports.placeOrder = async(req, res) => {
    // console.log(req.body)
    // res.render('pages/home', {user: req.session.username, page: 'success'})

    try {
        if(req.body.message) {
            let place_order = await ordermodel.insertMany([{
                orderid: req.body.data.orderid,
                order: req.body.data.order,
                status: req.body.data.status,
                userid: new ObjectId(req.body.data.userid),
                totalprice: req.body.data.totalprice,
                payment: req.body.data.payment,
                address: req.body.data.address,
                firstname: req.body.data.firstname,
                lastname: req.body.data.lastname,
                phone: req.body.data.phone,
                town: req.body.data.town,
                email: req.body.data.email
            }])
            
            // res.render('pages/home', {user: req.session.username, page: 'success'})
            // res.redirect('/' + req.session.username + '/checkout/auth_order?price='+req.query.price)
            // res.redirect('/' + req.session.username + '/succes')
            // return
        }
        let dat = await usermodel.findOne({ name: req.session.username })
        address = dat.address[mainpay.address]
        let total = Number(req.query.price)
        mainpay.total = total
        
        function getRandomNumber(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min
        }
        const randomNumber = getRandomNumber(10000, 99999)

        if(main_payment === 'COD' || mainpay.type) {
            if(req.query.price) {
                if(this.couponApply[1] !== undefined) {
                    let place_order = await ordermodel.insertMany([{
                        orderid: '#'+randomNumber,
                        status: 'pending',
                        userid: dat._id,
                        order: dat.cart,
                        totalprice: this.couponApply[1],
                        payment: mainpay.type ? 'wallet purchase' :  'cash on delivery',
                        address: address.address,
                        firstname: address.firstname,
                        lastname: address.lastname,
                        phone: address.phone,
                        town: address.town,
                        email: address.email,
                        coupon: this.couponApply[0]
                    }])

                    const wallet = await usermodel.findOneAndUpdate(
                        {name: req.session.username},
                        { $inc: { wallet: mainpay.total } }
                    )
                } else {
                    let place_order = await ordermodel.insertMany([{
                        orderid: '#'+randomNumber,
                        status: 'pending',
                        userid: dat._id,
                        order: dat.cart,
                        totalprice: total,
                        payment: mainpay.type ? 'wallet purchase' :  'cash on delivery',
                        address: address.address,
                        firstname: address.firstname,
                        lastname: address.lastname,
                        phone: address.phone,
                        town: address.town,
                        email: address.email
                    }])
                }

                const wallet = await usermodel.findOneAndUpdate(
                    {name: req.session.username},
                    { $inc: { wallet: mainpay.total } }
                )
                
                dat.cart.map(item => {
                    let update_item = itemmodel.findOneAndUpdate(
                        { _id: item.item },
                        { $inc: { stock: - item.count } }
                    ).then(data => {
                        // console.log(data)
                    })
                })

                const last_order = await ordermodel.find({})

                const orders = last_order[last_order.length - 1]
                
                const orderList = [];

                setTimeout(async () => {
                  for (const item of orders.order) {
                    try {
                      const data = await itemmodel.findOne({ _id: item.item })
                      console.log(data.name)
                      orderList.push({
                        name: data.name,
                        price: data.price,
                        count: item.count,
                        image: data.image[0],
                      });
                    } catch (error) {
                      console.error("Error fetching data:", error);
                    }
                  }

                  res.render('pages/home', {user: req.session.username, page: 'success', orders: orderList})
                }, 500)
                                
            }
        } else {
            const last_order = await ordermodel.find({})
            const orders = last_order[last_order.length - 1]

            const orderList = [];

            setTimeout(async () => {
              // Assuming that orders.order is an array of items you want to retrieve
              for (const item of orders.order) {
                try {
                  const data = await itemmodel.findOne({ _id: item.item });
                  console.log(data.name);
                  orderList.push({
                    name: data.name,
                    price: data.price,
                    count: item.count,
                    image: data.image[0],
                  });
                } catch (error) {
                  console.error("Error fetching data:", error);
                }
              }
            
              res.render('pages/home', {user: req.session.username, page: 'success', orders: orderList})
            }, 500)
        }
    } catch (error) {
        console.log(error.message, ' is from here')
    }
}

module.exports.viewOrder = async(req, res) => {                           
    const data = await getOrderDetails(req.session.username)
    const order = await ordermodel.findOne({orderid: req.body.id})
    const orderItems = []
    const coupondetails = [null]
    let n = 0
    
    for(let i of data[0]) {
        if(i.orderid === req.body.id) {
            for(let j of i.details) {
                let single = {}
                const item = await itemmodel.findOne({name: j.name})
                const count = order.order
                single.name = j.name
                single.category = item.category
                single.price = item.price
                single.total = count[n].count
                orderItems.push(single)
                n++
            }
        }
    }

    // console.log(orderItems)
    if(order.coupon) {
        coupondetails[0] = true
        coupondetails.push({name: order.coupon.name})
    }

    res.render('pages/user/profile/mainPage', 
    {
        page: 'viewOrder', 
        user: req.session.username,
        items: orderItems, address: {
            mainid: order.id,
            id: order.orderid,
            address: order.address,
            fname: order.firstname,
            lname: order.lastname,
            ph: order.phone,
            town: order.town,
            email: order.email,
            status: order.status,
            coupon: coupondetails[0] !== null ? coupondetails[1].name : 'null',
        }
    })
}

module.exports.removeOrder = async(req, res) => {
    const updateorder = await ordermodel.updateOne(
        {orderid: req.body.id},
        { $set: { status: 'cancel' } }
    )
    const findit = await ordermodel.findOne({orderid: req.body.id})
    if(findit.payment === 'razorpay') {
        const usermod = await usermodel.updateOne(
            {name: req.session.username},
            { $inc: { wallet: findit.totalprice } }
        )
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
                // console.log('herer...')
                const insertfirst = await salesCountModel.findOneAndUpdate(
                    { order: [salesNum - 1] },
                    { $inc: { return: 1 } }
                )
                
                if(insertfirst === null) {
                    const insertfirst = await salesCountModel.insertMany([
                        { sales: 0, return: 1, date: formattedDate, order: salesNum }
                    ])
                }
            }
        } else {
            const insertfirst = await salesCountModel.insertMany([
                { sales: 0, return: 1, date: formattedDate, order: salesNum }
            ])
        }
    }

    res.redirect('/' + req.session.username + '/orders')
}

module.exports.returnOrder = async(req, res) => {
    const updateorder = await ordermodel.updateOne(
        { orderid: req.body.id },
        { $set: { status: 'return' } }
    )
    
    res.redirect('/' + req.session.username + '/orders')
}

module.exports.authOrder = async(req, res) => {
    try {
        const amount = 100
        const options = {
            amount: amount,
            currency: 'INR',
            receipt: 'razorUser@gmail.com'
        }

        if(main_payment === 'Razorpay') {
            let total = Number(this.mainPrice) * amount
            let dat = await usermodel.findOne({ name: req.session.username })
            
            function getRandomNumber(min, max) {
                return Math.floor(Math.random() * (max - min + 1)) + min
            }
              
            const randomNumber = getRandomNumber(10000, 99999)

            address = dat.address[mainpay.address]

            instance.orders.create(options,
                (err, order)=>{
                    if(!err){
                        res.status(200).send({
                            success:true,
                            key_id:RAZORPAY_ID_KEY,
                            orderid: '#'+randomNumber,
                            status: 'pending',
                            userid: dat._id,
                            order: dat.cart,
                            totalprice: total,
                            payment: 'razorpay',
                            address: address.address,
                            firstname: address.firstname,
                            lastname: address.lastname,
                            phone: 8891387645,
                            town: address.town,
                            email: address.email
                        });
                    }
                    else{
                        res.status(400).send({success:false,msg:'Something went wrong!'})
                    }
                }
            )
        } else {
            // res.render('pages/home', {user: req.session.username, page: 'success'})
        }
    } catch (error) {
        console.log(error.message);
    }
}

module.exports.setPayment = async(req, res) => {
    try {        
        main_payment = req.body.payment
        let numericValue = 0

        if(req.body.amount) {
            const inputString = req.body.amount
            const regex = /\d+/
            
            const match = inputString.match(regex)
            if (match) {
                numericValue = parseInt(match[0], 10)
                // console.log(numericValue)
            }
        }
        
        if(main_payment === 'Wallet') {
            const walletAmount = await usermodel.findOne({name: req.session.username})
            console.log(walletAmount.wallet, numericValue)
            if(walletAmount.wallet >= numericValue) {
                mainpay.type = main_payment
                res.json({msg: 'payment_set'})
            } else {
                res.status(501).json({msg: 'no_wallet'})
            }
        }
    } catch (error) {
        console.log(error)
    }
}

module.exports.setAddress = (req, res) => {
    if(req.body) {
        mainpay.address = req.body.address
    }
}

module.exports.setPrice = (req, res) => {
    this.mainPrice = req.body.price
}

async function getitem(data) {
    const item = await itemmodel.findOne({_id: data.item})

    if(item !== null) {
        return {
            name: item.name,
            price: item.price,
            count: data.count,
            total: data.count * item.price
        }
    } else {
        return 'no_product'
    }
}

module.exports.invoice = async(req, res) => {
    const invoice = await ordermodel.findOne({_id: req.query.id})
    const orderItems = []
    let n = 0

    invoice.order.map(item => {
        getitem(item).then(data => {
            if(data !== 'no_product') {
                orderItems.push(data)
            }
        })
    })

    setTimeout(() => {
        console.log(orderItems)

        const doc = new PDFDocument()
        const stream = fs.createWriteStream('invoice.pdf')
    
        doc.pipe(stream)
    
        doc.fontSize(40).text('Invoice', { align: 'center' })
        doc.moveDown(0.5)

        doc.fontSize(24).text('Order-Details', { align: 'center' })
        doc.moveDown(0.5)

        doc.fontSize(14).text('User :       ' + invoice.firstname, { align: 'start' })
        doc.moveDown(0.3)
        
        doc.fontSize(14).text('Order id :   ' + invoice.orderid, { align: 'start' })
        doc.moveDown(0.3)
        doc.fontSize(14).text('Status :     ' + invoice.status, { align: 'start' })
        doc.moveDown(0.3)

        doc.fontSize(14).text('totalPrice : ' + invoice.totalprice, { align: 'start' })
        doc.moveDown(0.3)

        doc.fontSize(14).text('Address :    ' + invoice.address, { align: 'start' })
        doc.moveDown(0.3)
    
        doc.moveDown(0.5)
        doc.fontSize(24).text('Product-Details', { align: 'center' })
        doc.moveDown(0.5)

        const space = '       '

        orderItems.map(item => {
            doc.fontSize(14).text('name : ' + String(item.name) + space + 
            'price : ' + String(item.price) + space + 'count : ' + String(item.count) + space +
            'total : ' + String(item.total),  {align: 'start'})
            doc.moveDown(0.3)
        })
        doc.end()
    
        // console.log(invoice)
    
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=example.pdf');
      
        // Pipe the PDF to the response stream
        doc.pipe(res)
    }, 400);

    // res.redirect('')
}

module.exports.amountType = ''