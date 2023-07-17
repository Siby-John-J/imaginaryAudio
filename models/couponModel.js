const mongoose = require('mongoose')
const db = require('../config/db')

const couponSchema = mongoose.Schema({
    name: String,
    code: String,
    type: String,
    value: Array,
    Purchase: Number,
    limit: Array,
    products: Array,
    position: String,
    color: String
})

module.exports = db.model('coupons', couponSchema)
