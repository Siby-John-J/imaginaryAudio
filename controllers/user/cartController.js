
const cartmodel = require('../../models/cartModel')
const usermodel = require('../../models/userModel')
const { itemmodel } = require('../../models/productsModel')

module.exports.cart = (req, res) => {
    usermodel.findOne({name: req.session.username}).then(data => {
        console.log(data.cart)
        itemmodel.findOne({_id: data[0].item}).then(data2 => {
            res.render('pages/user/cart', {user: req.session.username, data: data2})
        })
    })
}

module.exports.addToCart = (req, res) => {
    console.log(req.query.name)
    itemmodel.findOne({name: req.query.name}).then(data => {
        usermodel.updateOne(
            {name: req.session.username},
            {$push: {cart: {item: data._id, count: 1}}}
        ).then(data1 => {})
    })
    res.send('pages/user/cart')
}