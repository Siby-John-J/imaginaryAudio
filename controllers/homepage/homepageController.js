const { itemmodel, categorymodel } = require('../../models/productsModel')
const usermodel = require('../../models/userModel')
const bannermodel = require('../../models/bannerModel')

const { blockUser } = require('../user/userAccess')

// All about the user page
async function loadUserData(user) {
    return await usermodel.findOne({name: user})
}

module.exports.homepageLoad = (req, res) => {
    if(!req.session.isUserLogin) {
        res.redirect('/')
        return
    } else if(req.session.isUserLogin) {
        try {
            loadUserData(req.session.username).then(data => {

                if(data.status === false) {
                    res.render('pages/login',{type: 'email'})
                } else {
                    let fulldata = []
                    let category = []
                    let mainData = []
                    let n = 0
                    
                    categorymodel.find({}).then(data1 => {
                        category = data1
                        itemmodel.find({}).then(data2 => {
                            for(let j of data2) {
                                fulldata
                                .push({name: j['name'], price: j['price'], 
                                image: j['image'], category: j['category'],
                                access: j['access'] })
                            }
                            
                            let sub = []
                            for(let i of fulldata) {
                                if(sub.length <= 3) {
                                    sub.push(i)
                                    n++
                                } else {
                                    sub.push(i)
                                    mainData.push(sub)
                                    sub = []
                                    n = 0
                                }
                            }
                            mainData.push(sub)

                            bannermodel.find({}).then(banner => {
                                res.render('pages/home', {
                                    data: fulldata, cate: category,  
                                    user: req.session.username, page: 'products',
                                    banner: banner
                                })
                            })

                        }).then(dat => {})
                        // cate = data
                    }).then(dat => {})
                }
            })
        } catch (err) {
            res.status(500).send('internal error')
        }
        return
    }
}

module.exports.listpageLoad = (req, res) => {
    if(!req.session.isUserLogin) {
        res.redirect('/')
        return
    } else if(req.session.isUserLogin) {
        try {
            loadUserData(req.session.username).then(data => {

                if(data.status === false) {
                    res.render('pages/login',{type: 'email'})
                } else {
                    let fulldata = {}
                    let category = []
                    
                    categorymodel.find({}).then(data1 => {
                        category = data1
                        itemmodel.find({}).then(data2 => {
                            for(let i of data1) {
                                fulldata[i['name']] = []
                                for(let j of data2) {
                                    if(i['name'] === j['category']) {
                                        fulldata[i['name']]
                                        .push({name: j['name'], price: j['price'], 
                                        image: j['image'], category: j['category']})
                                    }
                                }
                            }
                            
                            for(let i in fulldata) {
                                if(fulldata[i].length <= 0) {
                                    continue
                                }
                            }
                            res.render('pages/home', {data: fulldata, user: req.session.username, page: 'seperate'})
                        }).then(dat => {})
                    }).then(dat => {})
                }
            })
        } catch (err) {
            res.status(500).send('internal error')
        }
        return
    }
}

module.exports.productLoad = async(req, res) => {
    try {
        let incart = false
        let review = null
        let sum = 0
        let n = 1
        let avg = 0

        const subtotal = {
            '5': 0,
            '4': 0,
            '3': 0,
            '2': 0,
            '1': 0,
        }

        const product = await itemmodel.findOne({name: req.params.id})
        const user = await usermodel.findOne({name: req.session.username})

        if(product === null) {
            res.render('pages/404')
        }
        
        product.reviews.reviews.map(content => {
            subtotal[String(content.rating)]++
        })

        for(let i of user.cart) {
            if(product !== null && i.item.toString() === product._id.toString()) {
                incart = true
                break
            }
        }

        if(product.reviews.length <= 0) { } else {
            review = product.reviews
        }

        for(let i of review.reviews) {
            review.overall[String(i.rating)]++
        }
        
        const values = Object.values(review.overall)
        sum = values.reduce((acc, value) => acc + value, 0)
        
        const average = sum / values.length
        
        if(req.session.isUserLogin) {
            res.render('pages/user/item', {
                avg: Math.ceil(average),
                data: product, user: req.session.username, 
                incart: incart, review: review.reviews, total: subtotal
            })
        } else {
            res.redirect('/')
        }
    } catch (error) {
        console.log(error.message)
    }
}
