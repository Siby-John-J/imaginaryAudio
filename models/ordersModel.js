const mongoose = require('mongoose')
const db = require('../config/db')

let orderSchema = mongoose.Schema({
    orderid: String,
    status: String,
    userid: Object,
    totalprice: Number,
    payment: String,
    order: Array,
    address: String,
    firstname: String,
    lastname: String,
    phone: Number,
    town: String,
    email: String,
    coupon: Object
})

let order = db.model('orders', orderSchema)

module.exports = order