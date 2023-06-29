// const {isadminlogin, adminmiddlware} = require('../../middlewares/adminMiddleware')
const { categorymodel, itemmodel } = require('../../models/productsModel')

module.exports.products = (req, res) => {
    if(req.session.isadminlogin) {
        res.redirect('/admin/login')
    } else {
        itemmodel.find({}).then(data => {
            calculate().then(data1 => {
                res.render('pages/admin/mainpage', {page: "products", data: data, countes: data1})
            })
        })
    }
    calculate()
    
    async function calculate() {
        let totalProd = await itemmodel.find({}).count()
        let category = await categorymodel.find({}).count()
        
        return [totalProd, category]
    }
}

module.exports.addProduct = (req, res) => {
    categorymodel.find({}, {name: 1}).then(data => {
        res.render('pages/admin/addProduct', {data: data, type: 'add'})
    })
}

module.exports.editProduct = (req, res) => {
    categorymodel.find({}, {name: 1}).then(data2 => {
        itemmodel.findOne({ name: req.query.prod }).then(data1 => {
            res.render('pages/admin/addProduct', {data: data2, contents: data1, type: 'edit'})
        })
    })
}

module.exports.editProductAuth = (req, res) => {
    let date = new Date()
    let newdate = date.getDay().toString() + '-' + date.getMonth().toString() 
    + '-' + date.getFullYear().toString()
    
    console.log(req.query)
    itemmodel.findOneAndUpdate(
        { _id: req.query.id },
        {
            name: req.body.pname,
            price: Number(req.body.pprice),
            category: req.body.pcat,
            image: req.body.imageUpload,
            description: req.body.pdesc,
            date: newdate,
            stock: req.body.pstock,
            status: 'in stock'
        }
    ).then(data => {})
    res.redirect('/admin/products')
}

module.exports.deleteProduct = (req, res) => {
    // console.log(req.body)
    if(typeof req.body.check === 'string') {
        itemmodel.deleteOne({name: req.body.check}).then(data => {})
    } else {
        for(let i of req.body.check) {
            itemmodel.deleteOne({name: i}).then(data => {})
        }
    }
    
    res.redirect('/admin/products')
}


module.exports.authProduct = (req, res) => {
    let date = new Date()
    let newdate = date.getDay().toString() + '-' + date.getMonth().toString() 
    + '-' + date.getFullYear().toString()

    let formats = []
    console.log('here imposter..')
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
    // console.log(req.body)

    itemmodel.insertMany([{
        name: req.body.pname,
        price: Number(req.body.pprice),
        category: req.body.pcat,
        image: req.body.imageUpload,
        description: req.body.pdesc,
        date: newdate,
        stock: req.body.pstock,
        status: 'in stock'
    }]).then(data => {})
}
