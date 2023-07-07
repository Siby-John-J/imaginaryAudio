const mongoose = require('mongoose')
const db = require('../config/db')

let orderSchema = mongoose.Schema({
    orderid: String,
    userid: Object,
    order: Array
})

let order = db.model('orders', orderSchema)

module.exports = order