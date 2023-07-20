let usrmodel = require('../../models/userModel')

module.exports.applyCoupon = async(req, res) => {

    // let user = await usrmodel.findOne({name: req.session.username})

    res.redirect('/' + req.session.username + '/checkout')
}
