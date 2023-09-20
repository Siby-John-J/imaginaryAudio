const usermodel = require('../../models/userModel')
const salesmodel = require('../../models/salesModel')
const { categorymodel, itemmodel } = require('../../models/productsModel')
const { salesCountModel } = require('../../models/dashboardModel')
const ordermodel = require('../../models/ordersModel')

module.exports.dashboard = async(req, res) => {
    if(req.session.isAdminLogin) {
        const countsales = await ordermodel.find({status: 'delivered'}).count()
        const countorders = await ordermodel.find({}).count()
        const countproducts = await itemmodel.find({}).count()
        const countuser = await usermodel.find({}).count()

        res.render('pages/admin/mainpage', {
            page: "dashboard",
            count: [countsales, countproducts, countuser, countorders]
        })
    } else {
        res.redirect('/admin/login')
    }
}

module.exports.dashboardData = async(req, res) => {
    const sales = await salesCountModel.find({})
    res.json({key: sales})
}
