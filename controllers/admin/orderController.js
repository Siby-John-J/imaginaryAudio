const ordermodel = require('../../models/ordersModel')
const usermodel = require('../../models/userModel')
const { itemmodel } = require('../../models/productsModel')

module.exports.orders = async(req, res) => {
    const data = []

    let orders = await ordermodel.find()
    
    for(let i of orders) {
        let user = await usermodel.findOne({ _id: i.userid })
        // console.log(user.name)
        let prod = []
        
        for(let j of i.order) {
            let product = await itemmodel.findOne(
                { _id: j.item },
                {_id: 0, name: 1}
            )
            prod.push(product.name)
        }

        data.push({
            orderid: i._id,
            products: prod,
            user: user.name,
            price: i.totalprice,
            status: i.status,
            payment: i.payment,
        })
        
        console.log(i.status)
    }
    
    res.render('pages/admin/mainPage', {page: 'orders', data: data})
}

module.exports.editOrder = async(req, res) => {
    let order = await ordermodel.updateOne(
        {_id: req.body.id},
        { $set: { status: req.body.status } }
    )
    
    res.redirect('/admin/orders')
}