
const cartmodel = require('../../models/cartModel')
const usermodel = require('../../models/userModel')
const { itemmodel } = require('../../models/productsModel')

module.exports.cart = async(req, res) => {
    let data = []
    
    if(req.session.isUserLogin) {
        let user = await usermodel.findOne({name: req.session.username})
        
        if(user.cart.length <= 0) {
            res.render('pages/user/cart', {user: req.session.username, 
                data: null, address: '', visible: 'none', popup: ''})
        } else {
            for(let i of user.cart) {
                let products = await itemmodel.findOne({_id: i.item})
                data.push([products, i.count])
            }
            
            if(req.body.option) {
                res.render('pages/user/cart', {user: req.session.username, 
                    data: data, address: ['add', req.body.option], visible: 'flex', popup: ''})
                // check the datbase with user address 
            } else {
                res.render('pages/user/cart', {user: req.session.username, 
                    data: data, address: '', visible: 'none', popup: ''})
            }
        }
    } else {
        res.redirect('/')
    }
}

module.exports.addToCart = async(req, res) => {
    let find = await itemmodel.findOne({name: req.query.name})

    let check = await usermodel.findOne({
        name: req.session.username,
        cart: { $elemMatch: { item: find._id } }
    })

    if(check === null) {
        let findmain = await usermodel.updateOne(
            {name: req.session.username},
            {$push: {cart: {item: find._id, count: 1}}}
        )
    }
    res.redirect('/' + req.session.username + '/' + req.query.name)
}

module.exports.removeFromCart = async(req, res) => {
    let find = await itemmodel.findOne({name: req.query.name})

    let getid = await usermodel.updateOne(
        {name: req.session.username},
        {$pull: { cart: { item: find._id } }}
    )
    
    res.redirect('/' + req.session.username + '/cart')
}

module.exports.countCart = async(req, res) => {
    let user = await usermodel.findOne({name: req.session.username}, {cart: 1})

    for(let i of user.cart) {
        if(i.item.toString() === req.query.item) {
            if(req.query.num === 'max') {
                let sit = await usermodel.updateOne(
                    {name: req.session.username, 'cart.item': i.item },
                    { $inc: {'cart.$.count': 1}}
                )
            } else {
                if(i.count <= 0) {
                    res.redirect('/' + req.session.username + '/cart')
                    return
                } else {
                    let sit = await usermodel.updateOne(
                        {name: req.session.username, 'cart.item': i.item },
                        { $inc: {'cart.$.count': -1}}
                    )
                }
            }
        }
    }
    res.redirect('/' + req.session.username + '/cart')
}
