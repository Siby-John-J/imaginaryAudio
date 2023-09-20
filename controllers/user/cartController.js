let items = [0]

const cartmodel = require('../../models/cartModel')
const usermodel = require('../../models/userModel')
const { itemmodel } = require('../../models/productsModel')
const { ObjectId } = require('mongodb')

module.exports.cart = async(req, res) => {
    let data = []

    try {        
        if(req.session.isUserLogin) {
            let user = await usermodel.findOne({name: req.session.username})
            
            if(user.cart.length <= 0) {
                res.render('pages/user/cart', {user: req.session.username, 
                    data: null, address: '', visible: 'none', popup: ''})
            } else {
                for(let i of user.cart) {
                    let products = await itemmodel.findOne({_id: i.item})
                    if(products !== null) {
                        data.push([products, i.count])
                    }
                }
                
                if(req.body.option) {
                    res.render('pages/cartLoad', {user: req.session.username, 
                        data: data, address: ['add', req.body.option], 
                        visible: 'flex', popup: ''})
                } else {
                    if(req.query.mess) {
                        res.render('pages/cartLoad', {user: req.session.username, 
                            data: data, address: '', visible: 'none', popup: req.query.mess,
                            couponMessage: false, couponCode: ''})
                    } else {
                        res.render('pages/cartLoad', {user: req.session.username, 
                            data: data, address: '', visible: 'none', popup: '',
                            couponMessage: false, couponCode: ''})
                    }
                }
            }
        } else {
            res.redirect('/')
        }
    } catch (error) {
        console.log(error)
    }
    
}

module.exports.addToCart = async(req, res) => {
    try {        
        const find = await itemmodel.findOne({name: req.query.name})

        if(find.stock <= 0) {
            res.redirect('/' + req.session.username + '/' + req.query.name + '?mes=outOfStock')
        } else {
            const check = await usermodel.findOne({
                name: req.session.username,
                cart: { $elemMatch: { item: find._id } }
            })

            if(check === null) {
                const findmain = await usermodel.updateOne(
                    { name: req.session.username },
                    { $push: {cart: {item: find._id, count: 1 }}}
                )
            }

            res.redirect('/' + req.session.username + '/' + req.query.name)
        }
    
    } catch (error) {
        console.log(error.message)
    }
}

module.exports.removeFromCart = async(req, res) => {
    try {
        let find = await itemmodel.findOne({name: req.query.name})  
    
        let getid = await usermodel.updateOne(
            {name: req.session.username},
            {$pull: { cart: { item: find._id } }}
        )
        
        if(req.query.from) {
            res.redirect('/' + req.session.username + '/' + req.query.name)
        } else {
            res.redirect('/' + req.session.username + '/cart')
        }
    } catch (error) {
        console.log(error)
    }
}

module.exports.countCart = async(req, res) => {
    let subtotal = 0
    let total = 0
    let n = 0

    try {
        const user = await usermodel.findOne({name: req.session.username}, {cart: 1})
        
        // count updation along with stock updation
        for(let i of user.cart) {
            if(i.item.toString() === req.query.item) {
                if(req.query.num === 'max') {
                    const sit = await usermodel.updateOne(
                        {name: req.session.username, 'cart.item': i.item },
                        { $inc: {'cart.$.count': 1}}
                    )
                } else {
                    if(i.count <= 1) {
                        res.redirect('/' + req.session.username + '/cart')
                        return
                    } else {
                        const sit = await usermodel.updateOne(
                            {name: req.session.username, 'cart.item': i.item },
                            { $inc: {'cart.$.count': -1}}
                        )
                    }
                }
            }
        }
    
        // changing the total in cart
        // [+] PENDING
        const product = await itemmodel.findOne({ _id: new ObjectId(req.query.item)})
        const cartItem = await usermodel.findOne(
            {name: req.session.username},
            { cart: 1 }
        )
    
        for(let i of cartItem.cart) {
            n++
            if(req.query.item === i.item.toString()) {
                total = product.price * i.count
                // items.push(total)
            }
        }
    
        cartItem.cart.map(async(prod) => {
            const each = await itemmodel.findOne({_id: new ObjectId(prod.item)})
            // console.log(prod.count, each.price)
            if(each !== null) {
                subtotal = subtotal + prod.count * each.price
                items.push(subtotal)
            }
        })
    
        setTimeout(() => {
            res.json({user: req.session.username, total: total, subtotal: subtotal})
        }, 5);
        
    } catch (error) {
        console.log(error)   
    }
}

module.exports.clearCart = async(req, res) => {
    let user = await usermodel.updateOne({name: req.session.username}, {cart: []})

    res.redirect('/' + req.session.username + '/cart')
}
