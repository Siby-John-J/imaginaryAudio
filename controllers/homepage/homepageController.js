const { itemmodel, categorymodel } = require('../../models/productsModel')
const usermodel = require('../../models/userModel')

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
                    let fulldata = {}
                    
                    categorymodel.find({}).then(data1 => {
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
                            res.render('pages/home', {data: fulldata, user: req.session.username, page: 'products'})
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
                    
                    categorymodel.find({}).then(data1 => {
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

module.exports.productLoad = (req, res) => {
    if(req.session.isUserLogin) {
        itemmodel.findOne({name: req.params.id}).then(data => {
            res.render('pages/user/item', {data: data, user: req.session.username})
        })
    } else {
        res.redirect('/')
    }
}
