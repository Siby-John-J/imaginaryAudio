

const usermodel = require('../../models/userModel')
const { itemmodel } = require('../../models/productsModel')

module.exports.checkout = async(req, res) => {
    let products = []
    
    let data = await usermodel.findOne({name: req.session.username})

    for(let i of data.cart) {
        let item = await itemmodel.findOne({_id: i.item})
        products.push([i.count, item])
    }
    
    res.render('pages/home', {user: req.session.username, page: 'checkout',
    products: products, data: data})
}

module.exports.placeOrder = async(req, res) => {
    res.send('order placed')
}