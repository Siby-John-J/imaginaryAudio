const usermodel = require('../../models/userModel')

module.exports.customers = (req, res) => {
    if(!req.session.isAdminlogin) {
        usermodel.find({}, {}).then(data => {
            res.render('pages/admin/mainpage', {page: "customers", content: data})
        })
    } else {
        res.redirect('/admin/login')
    }
}

module.exports.userBlock = (req, res) => {
    if(req.query.status === 'true') {
        usermodel.findOneAndUpdate(
            {name: req.query.user},
            { $set: {status: false}}
        ).then(data => {})
    } else if(req.query.status === 'false') {
        usermodel.findOneAndUpdate(
            {name: req.query.user},
            { $set: {status: true}}
        ).then(data => {})
    }
    res.redirect('/admin/customers')
}
