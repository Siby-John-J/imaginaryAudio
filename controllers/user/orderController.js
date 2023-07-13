const usermodel = require('../../models/userModel')
const ordermodel = require('../../models/ordersModel')
const { itemmodel } = require('../../models/productsModel')

async function getOrderDetails(username, orderid='') {
    let data = []
    
    let user = await usermodel.findOne({name: username})
    let cart = await ordermodel.find( { userid: user._id } )

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
                address: ''
            })
            
            return data
        } else {
            for(let i of cart) {
                let prod = []
                
                for(let j of i.order) {
                    let product = await itemmodel.findOne(
                        { _id: j.item }
                    )
                    
                    prod.push({
                        name: product.name,
                        img: product.image[0]
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
                    arriving: '19/12/2032'
                })
                
            }
        }
    }

    return [data, user]
}

module.exports.orders = async(req, res) => {

    let data = await getOrderDetails(req.session.username)

    res.render('pages/user/profile/mainPage', {page: 'orders',
    data: data[1], user: req.session.username, cart: data[0]})
}

module.exports.placeOrder = async(req, res) => {

    let total = Number(req.query.price)
    
    let dat = await usermodel.findOne(
        { name: req.session.username },
        { cart: 1}
    )
    
    let number = '#12321'
    
    let place_order = await ordermodel.insertMany([{
        orderid: number,
        status: 'pending',
        userid: dat._id,
        order: dat.cart,
        totalprice: total,
        payment: 'cash on delivery'
    }])
    
    res.render('pages/user/cart', {user: req.session.username, 
        data: null, address: '', visible: 'none', popup: 'true'
    })
}

module.exports.viewOrder = async(req, res) => {
    let data = await getOrderDetails(req.session.username, req.query.id)

    let user = await usermodel.findOne(
        {name: req.session.username}
    )
    
    res.render('pages/user/profile/mainPage', {page: 'viewOrder', data: user,
    cart: data})
}

module.exports.removeOrder = async(req, res) => {
    let updateorder = await ordermodel.updateOne(
        {_id: req.query.id},
        { $set: { status: 'cancel' } }
    )

    res.redirect('/' + req.session.username + '/orders')
}
