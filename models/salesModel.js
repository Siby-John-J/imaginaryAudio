const mongoose = require('mongoose')
const db = require('../config/db')

const salesModel = mongoose.Schema({
    orderid: String,
    user: String,
    date: String,
    phone: Number,
    address: String,
    total: Number,
    payment: String,
    products: Array
})

module.exports = db.model('salesReport', salesModel)
