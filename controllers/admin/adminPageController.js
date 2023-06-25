
const usermodel = require('../../models/userModel')
const { categorymodel, itemmodel } = require('../../models/productsModel')

const { access } = require('fs')

let isadminlogin = null

module.exports.mainpage = (req, res) => {
    res.render('pages/admin/mainpage')
}

module.exports.dashboard = (req, res) => {
    isadminlogin = req.session.isAdminLogin

    if(isadminlogin) {
        res.render('pages/admin/mainpage', {page: "dashboard"})
    } else {
        res.redirect('/admin/login')
    }
}

module.exports.customers = (req, res) => {
    if(!isadminlogin) {
        res.redirect('/admin/login')
    } else {
        usermodel.find({}, {}).then(data => {
            // console.log(data)
            res.render('pages/admin/mainpage', {page: "customers", content: data})
        })
    }
}

module.exports.products = (req, res) => {
    console.log(isadminlogin)
    if(!isadminlogin) {
        res.redirect('/admin/login')
    } else {
        itemmodel.find({}).then(data => {
            res.render('pages/admin/mainpage', {page: "products", data: data})
        })
    }
}

module.exports.category = (req, res) => {
    let datas = []
    if(!isadminlogin) {
        res.redirect('/admin/login')
    } else {
        categorymodel.find({}).then(data => {
            res.render('pages/admin/mainpage', {page: "category", data: data})
        })
    }
}

module.exports.addProduct = (req, res) => {
    categorymodel.find({}, {name: 1}).then(data => {
        res.render('pages/admin/addProduct', {data: data})
    })
}

module.exports.setCategory = (req, res) => {
    console.log(req.body)
    if(req.body.addcat === '') {
        // res.redirect('/admin/category')
    } else if(req.body.action || req.body.control) {
        if(req.body.action) {
            const [item, count] = req.body.action.split(',')
            
            if(count === 'min') {
                categorymodel.findOneAndUpdate(
                    {name: item},
                    {$inc: {stock: -1}}
                    ).then(data => {})
                } else if(count === 'max') {
                    categorymodel.findOneAndUpdate(
                    {name: item},
                    {$inc: {stock: 1}}
                ).then(data => {})
            }
        } else if(req.body.control) {
            const [item, action] = req.body.control.split(',')
            
            categorymodel.deleteOne({
                name: item
            }).then(data => {})
        }
    } else {
        categorymodel.findOne({
            name: req.body.addcat
        }).then(data => {
            if(data === null) {
                categorymodel.insertMany([{
                    name: req.body.addcat,
                    stock: 1,
                    active: true
                }])
            }
        })
    }
    res.redirect('/admin/category')
}

module.exports.authProduct = (req, res) => {
    console.log('hey man..')
    let formats = []
    let date = new Date()
    let newdate = date.getDay().toString() + '-' + date.getMonth().toString() 
    + '-' + date.getFullYear().toString()
    req.body.date = newdate
    
    for(let i in req.body) {
        if(i === 'pname') {
            break
        } else if(req.body[i] === '') {
            continue
        } else {
            const regex = req.body[i].match(/\.([^.]+)$/)[1]
            formats.push(regex)
        }
    }

    function accessToimg(formats) {
        for(i of formats) {
            if(i !== 'jpg' && i !== 'png') {
                res.redirect('/admin/addproduct')
                return
            }
        }
        res.redirect('/admin/products')
    }
    accessToimg(formats)

    itemmodel.insertMany([{
        name: req.body.pname,
        price: Number(req.body.pprice),
        category: req.body.pcat,
        description: req.body.pdesc,
        date: newdate,
        stock: req.body.pstock,
        status: 'in stock'
    }]).then(data => {})
}
