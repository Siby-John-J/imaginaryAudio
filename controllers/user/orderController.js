const usermodel = require('../../models/userModel')
const ordermodel = require('../../models/ordersModel')
const { itemmodel } = require('../../models/productsModel')

module.exports.orders = async(req, res) => {
    let data = []

    let user = await usermodel.findOne({name: req.session.username})
    let cart = await ordermodel.findOne( { userid: user._id } )

    if(cart) {
        data.push(cart._id.toString())
        
        for(let i of cart.order) {
            let products = await itemmodel.findOne({_id: i.item})
            data.push([products, i.count])
        }
    }
    
    res.render('pages/user/profile/mainPage', {page: 'orders',
    data: user, user: req.session.username, cart: data})
}

module.exports.placeOrder = async(req, res) => {
    let dat = await usermodel.findOne(
        { name: req.session.username },
        { cart: 1}
    )
    
    let number = '#12321'
    
    let place_order = await ordermodel.insertMany([{
        orderid: number,
        userid: dat._id,
        order: dat.cart
    }])

    res.render('pages/user/cart', {user: req.session.username, 
        data: null, address: '', visible: 'none', popup: 'true'
    })
}

module.exports.removeOrder = async(req, res) => {
    // console.log(req.query)

    let deleteorder = await ordermodel.deleteOne({_id: req.query.id})

    res.redirect('/' + req.session.user + '/orders')
}