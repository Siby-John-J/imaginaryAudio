
const { categorymodel } = require('../../models/productsModel')
const { itemmodel } = require('../../models/productsModel')

module.exports.loadProducts = async(req, res) => {
    const categoryList = await categorymodel.find({}, {_id: 0, name: 1, stock: 1})
    let items = null
    if(req.query.cate) {
        const item = await itemmodel.find({category: req.query.cate})
        items = item
    } else {
        const item = await itemmodel.find({})
        items = item
    }
    // Start from here by categozing brands / company
    console.log(req.query)
    res.render('pages/home', {
        page: 'productlist', user: req.session.username,
        category: categoryList, items: items
    })
}

