const { itemmodel, categorymodel } = require('../../models/productsModel')

module.exports.homepageLoad = (req, res) => {
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
            res.render('pages/home', {data: fulldata})
        }).then(dat => {})
        // cate = data
    }).then(dat => {})
}