const { itemmodel, categorymodel } = require('../../models/productsModel')

// All about the user page

module.exports.homepageLoad = (req, res) => {
    if(!req.session.isUserLogin) {
        res.redirect('/')
        return
    }
    let fulldata = {}

    categorymodel.find({}).then(data1 => {
        itemmodel.find({}).then(data2 => {
            for(let i of data1) {
                fulldata[i['name']] = []
                for(let j of data2) {
                    if(i['name'] === j['category']) {
                        fulldata[i['name']]
                        .push({name: j['name'], price: j['price'], image: j['image']})
                    }
                }
            }
            
            for(let i in fulldata) {
                if(fulldata[i].length <= 0) {
                    continue
                }
            }
            
            res.render('pages/home', {data: fulldata})
        }).then(dat => {})
        // cate = data
    }).then(dat => {})
}