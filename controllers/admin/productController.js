// const {isadminlogin, adminmiddlware} = require('../../middlewares/adminMiddleware')
const { categorymodel, itemmodel } = require('../../models/productsModel')
// const { search } = require('../../router/adminRoute')

let steps = 0
let cate = ''
let search = ''
let filter = 0
let sort = 0

async function calculate() {
    let totalProd = await itemmodel.find({}).count()
    let category = await categorymodel.find({}).count()
    
    return [totalProd, category]
}

module.exports.products = async(req, res) => {
    let category = await categorymodel.find({})
    if(req.session.isadminlogin) {
        res.redirect('/admin/login')
    } else {
        let data = await itemmodel.find({}).limit(8)
        let data1 = await calculate()
        res.render('pages/admin/mainpage', {page: "products", data: data, 
        countes: data1, category: category, default_cate: ''})
    }
}

module.exports.addProduct = (req, res) => {
    categorymodel.find({}, {name: 1}).then(data => {
        res.render('pages/admin/addProduct', {data: data, type: 'add'})
    })
}

module.exports.editProduct = (req, res) => {
    categorymodel.find({}).then(data2 => {
        itemmodel.findOne({ name: req.query.prod }).then(data1 => {
            res.render('pages/admin/editProduct', {data: data1, category: data2, type: 'edit'})
        })
    })
}

module.exports.editProductAuth = async(req, res) => {
    let img = []
    
    try {
        if(req.files.length !== 0) {
            await Promise.all(
                req.files.map(file => {
                    img.push(file.originalname)
                })
            )
        }
    
        let date = new Date()
        let newdate = date.getDay().toString() + '-' + date.getMonth().toString() 
        + '-' + date.getFullYear().toString()
    
        await itemmodel.findOneAndUpdate(
            { _id: req.body.id },
            {
                name: req.body.pname,
                price: Number(req.body.pprice),
                category: req.body.pcat.trim(),
                description: req.body.pdesc,
                date: newdate,
                stock: req.body.pstock,
            }
        )
    
        if(img.length > 0) {
            await itemmodel.findOneAndUpdate(
                { _id: req.body.id },
                { image: img }
            )
            console.log('imaggine...')
        }
        
        res.redirect('/admin/products')
        
    } catch (error) {
        console.log(error.message)
    }

}

module.exports.deleteProduct = (req, res) => {
    if(typeof req.query.check === 'string') {
        itemmodel.deleteOne({name: req.query.check}).then(data => {})
    } else {
        for(let i of req.query.check) {
            itemmodel.deleteOne({name: i}).then(data => {})
        }
    }
    res.redirect('/admin/products')
}

module.exports.authProduct = async(req, res, next) => {
    let img = []
    try {
        let date = new Date()
        let newdate = date.getDay().toString() + '-' + date.getMonth().toString() 
        + '-' + date.getFullYear().toString()

        await Promise.all(
            req.files.map(file => {
                img.push(file.originalname)
            })
        )
        
        let insert = await itemmodel.insertMany([{
            name: req.body.pname,
            price: Number(req.body.pprice),
            category: req.body.pcat,
            image: img,
            description: req.body.pdesc,
            date: newdate,
            stock: req.body.pstock,
            status: 'in stock',
            access: true
        }])

        res.redirect('/admin/products')

    } catch (error) {
        next(error)
    }
}

module.exports.traverse = async(req, res) => {
    try {
        let data1 = await calculate()
        req.query.category ? cate = req.query.category : cate

        if(req.body.searchbar) {
            search = req.body.searchbar
        } else {
            search = ''
        }

        if(req.query.filter) {
            filter = req.body.filter
        }
        if(req.body.searchbar) {
            search = req.body.searchbar
        }
        if(req.query.sort === 'ascending') {
            sort = 1
        } else {
            sort = -1
        }
        
        let category = await categorymodel.find({})
        async function wrapAll() {
            if(cate === 'all' && filter !== 0) {
                if(filter === 'all') {
                    let data = await itemmodel.find({})
                                        
                    .limit(5).skip(steps)
                    res.render('pages/admin/mainpage', {page: "products",
                    data: data, countes: data1, category: category,
                    default_cate: cate})
                } else {
                    let data = await itemmodel.find({})
                    .sort({[filter]: [sort]}).limit(8).skip(steps)
                    res.render('pages/admin/mainpage', {page: "products",
                    data: data, countes: data1, category: category,
                    default_cate: cate})
                }
            } else if(cate === 'all' || search === '' && filter === 0){
                // console.log('herer..', filter)

                if(search !== '') {
                    let data = await itemmodel.find({name: search}).limit(8).skip(steps)
                    res.render('pages/admin/mainpage', {page: "products",
                    data: data, countes: data1, category: category,
                    default_cate: cate})
                } else {
                    let get = ''
                    if(cate === '') {
                        const data = await itemmodel.find({}).limit(8).skip(steps)
                        get = data
                    } else {
                        const data = await itemmodel.find({category: cate}).limit(8).skip(steps)
                        get = data
                    }
                    
                    res.render('pages/admin/mainpage', {page: "products",
                    data: get, countes: data1, category: category,
                    default_cate: cate})
                }
            } else {

                if(search) {
                    let data = await itemmodel.find({name: search})
                    .sort({[filter]: [sort]}).limit(8).skip(steps)
                    res.render('pages/admin/mainpage', {page: "products",
                    data: data, countes: data1, category: category,
                    default_cate: cate})
                } else {
                    
                    if(cate) {
                        let data = await itemmodel.find({category: cate})
                        .sort({[filter]: [sort]}).limit(8).skip(steps)
                        res.render('pages/admin/mainpage', {page: "products",
                        data: data, countes: data1, category: category,
                        default_cate: cate})
                    } else {
                        // console.log(filter, sort)
                        let data = await itemmodel.find({})
                        .sort({[req.query.filter]: [1]}).limit(8).skip(steps)
                        res.render('pages/admin/mainpage', {page: "products",
                        data: data, countes: data1, category: category,
                        default_cate: cate})
                    }
                }
            }
        }
        
        if(req.query.trav === 'next') {
            steps >= 25 ? steps = 25 : steps += 5
            wrapAll()
            return

        } else if(req.query.trav === 'prev') {
            steps <= 0 ? steps = 0 : steps -= 5
            wrapAll()
            return
        }
        wrapAll()
        
    } catch (error) {
        console.log(error.message)
    }
}
