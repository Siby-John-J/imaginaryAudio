
const usermodel = require('../../models/userModel')
const salesmodel = require('../../models/salesModel')
const { categorymodel, itemmodel } = require('../../models/productsModel')
const { ConversationListInstance } = require('twilio/lib/rest/conversations/v1/conversation')

const sharp = require('sharp')
const fs = require('fs')

module.exports.mainpage = (req, res) => {
    res.render('pages/admin/mainpage')
}

module.exports.category = async(req, res) => {
    if (req.session.isAdminlogin) {
        res.redirect('/admin/login')
    } else {
        try {
            const totalStock = await itemmodel.aggregate([
                { $group: { _id: '$category', totalStock: { $sum: '$stock' } } }
            ])
            
            for(let i of totalStock) {
                let update = await categorymodel.findOneAndUpdate(
                    { name: i._id },
                    { $set: { stock: i.totalStock } }
                )
            }
            
            const catPromise = await categorymodel.find({})

            res.render('pages/admin/mainpage', { page: "category", data: catPromise})
            
          } catch (error) {
            console.log(error.message)
        }
    }
}

module.exports.blockCategory = async(req, res) => {
    try {        
        if(req.query.active === 'enable') {
            const update = await categorymodel.findOneAndUpdate(
                { name: req.query.name },
                { $set: { active: false } }
                )
        } else if(req.query.active === 'disable') {
            const update = await categorymodel.findOneAndUpdate(
                { name: req.query.name },
                { $set: { active: true } }
            )
        }
    
        const category = await categorymodel.findOne({name: req.query.name})
        
        if(category.active === false) {
            const products = await itemmodel.updateMany(
                { category: [category.name] },  
                { $set: { access: false } }
            )
        } else {
            const products = await itemmodel.updateMany(
                { category: [category.name] },  
                { $set: { access: true } }
            )
        }
    
        res.redirect('/admin/category')
    } catch (error) {
        console.log(error.message)
    }
}

module.exports.editCategory = async(req, res) => {
    try {
        const cateData = await categorymodel.findOne({_id: req.body.id})
        
        const setName = await categorymodel.findOneAndUpdate(
            { name: cateData.name },
            { $set: { name: req.body.addcat } }
        )
        
        if(req.file) {
            const setImg = await categorymodel.findOneAndUpdate(
                { name: cateData.name },
                { $set: { image: req.file.originalname } }
            )
        }
        
        res.redirect('/admin/category')
    } catch (error) {
        console.log(error.message)
    }
}

module.exports.showEdit = async(req, res) => {
    const category = await categorymodel.findOne({name: req.query.name})
    res.render('pages/admin/mainpage', { page: "edit-category", data: category })
}

module.exports.setCategory = (req, res) => {
    if(!req.body.addcat) {
        if(req.body.addcat === '') {
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
                
                itemmodel.deleteMany({
                    category: item
                }).then(dat => {})
    
                categorymodel.deleteOne({
                    name: item
                }).then(data => {
                    console.log(data)
                })
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
    } else {
        let str = req.body.addcat.toLowerCase()
        categorymodel.findOne({ name: { $regex: new RegExp("^" + str + "$", "i") } }).then(data => {
            if(data) {
                res.redirect('/admin/category')
            } else {
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
                        
                        itemmodel.deleteMany({
                            category: item
                        }).then(dat => {})
                        
                        categorymodel.deleteOne({
                            name: item
                        }).then(data => {
                            console.log(data)
                        })
                    }
                } else {
                    categorymodel.findOne({
                        name: req.body.addcat
                    }).then(data => {
                        try {                            
                            if(data === null) {
                                if(req.file) {
                                    sharp(req.file.path).resize(1000, 1000)
                                    .toFile('public\\img\\cropped\\category\\' + req.file.originalname, (err, data) => {
                                        if(err) {
                                            console.log(err.message)
                                        }
                                    })
                                }
                                
                                categorymodel.insertMany([{
                                    name: req.body.addcat,
                                    stock: 1,
                                    active: true,
                                    image: req.file ? req.file.originalname : ''
                                }])
                            }
                        } catch (error) {
                            
                        }
                    })
                    res.redirect('/admin/category')
                }
            }
        })
    }
}
