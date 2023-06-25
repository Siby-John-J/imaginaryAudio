const { itemmodel } = require('../../models/productsModel')

module.exports.deleteProduct = (req, res) => {
    console.log(req.body)

    if(typeof req.body.check === 'string') {
        itemmodel.deleteOne({name: req.body.check}).then(data => {})
    } else {
        for(let i of req.body.check) {
            itemmodel.deleteOne({name: i}).then(data => {})
        }
    }
    
    res.redirect('/admin/products')
}