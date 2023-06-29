
const usermodel = require('../../models/userModel')
const { categorymodel, itemmodel } = require('../../models/productsModel')
const { ConversationListInstance } = require('twilio/lib/rest/conversations/v1/conversation')

module.exports.mainpage = (req, res) => {
    res.render('pages/admin/mainpage')
}

module.exports.dashboard = (req, res) => {
    if(!req.session.isAdminLogin) {
        res.redirect('/admin/login')
    } else {
        res.render('pages/admin/mainpage', {page: "dashboard"})
    }
}

module.exports.category = async(req, res) => {
    if (req.session.isAdminlogin) {
        res.redirect('/admin/login')
    } else {
        try {
            const catPromise = categorymodel.find({})
            const itemPromise = itemmodel.aggregate([
              { $group: { _id: '$category', totalStock: { $sum: '$stock' } } },
              { $project: { _id: 0, totalStock: 1 } }
            ])
      
            const [cat, item] = await Promise.all([catPromise, itemPromise])
            
            let j = 0;
            await render();
    
            async function render() {
              for (let i of cat) {
                // console.log(item)
                // categorymodel.findOneAndUpdate(
                //   { name: i.name },
                //   { $set: { stock: item[j].stock } }
                // )
                j++;
              }
            }

            
            categorymodel.find({}).then(data => {
                res.render('pages/admin/mainpage', { page: "category", data: data})
            })
      
          } catch (error) {
            // console.error(error)
            // Handle the error accordingly, such as displaying an error page or sending an error response
        }
    }
}

module.exports.blockCategory = (req, res) => {
    if(req.query.active === 'enable') {
        categorymodel.findOneAndUpdate(
            { name: req.query.name },
            { $set: { active: false } }
            ).then(dat => {})
    } else if(req.query.active === 'disable'){
        categorymodel.findOneAndUpdate(
            { name: req.query.name },
            { $set: { active: true } }
        ).then(dat => {})
    }

    res.redirect('/admin/category')
}

module.exports.setCategory = (req, res) => {
    if(!req.body.addcat) {
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
                console.log('<UWU>')
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
                        if(data === null) {
                            categorymodel.insertMany([{
                                name: req.body.addcat,
                                stock: 1,
                                active: true
                            }])
                        }
                    })
                    res.redirect('/admin/category')
                }
            }
        })
    }
}