const mongoose = require('mongoose')
const db = require('../config/db')

let orderSchema = mongoose.Schema({
    orderid: String,
    status: String,
    userid: Object,
    totalprice: Number,
    payment: String,
    order: Array
})

let order = db.model('orders', orderSchema)

module.exports = order