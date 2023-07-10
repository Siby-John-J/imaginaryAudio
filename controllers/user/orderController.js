const usermodel = require('../../models/userModel')
const ordermodel = require('../../models/ordersModel')
const { itemmodel } = require('../../models/productsModel')

module.exports.orders = async(req, res) => {
    let data = []

    let user = await usermodel.findOne({name: req.session.username})
    let cart = await ordermodel.find( { userid: user._id } )

    if(cart) {
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

    console.log(data[0].details)

    res.render('pages/user/profile/mainPage', {page: 'orders',
    data: user, user: req.session.username, cart: data})
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

module.exports.viewOrder = (req, res) => {
    
}

module.exports.removeOrder = async(req, res) => {
    let deleteorder = await ordermodel.deleteOne({_id: req.query.id})

    res.redirect('/' + req.session.user + '/orders')
}