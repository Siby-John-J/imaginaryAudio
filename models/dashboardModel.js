const mongoose = require('mongoose')
const db = require('../config/db')

const SalesAndReturn = mongoose.Schema({
    sales: Number,
    return: Number,
    date: String,
    order: Number
})

const TopSalesAndRating = mongoose.Schema({
    sales: Number,
    rating: String,
    date: String,
    order: Number
})

module.exports.salesCountModel = db.model('salesandreturn', SalesAndReturn)
module.exports.TopSalesRatingModel = db.model('salesandrating', TopSalesAndRating)
