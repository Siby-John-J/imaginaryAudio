const mongoose = require('mongoose')
const db = require('../config/db')

const categoryModel = mongoose.Schema({
    name: String,
    stock: Number,
    active: Boolean,
    image: String
})

const itemModel = mongoose.Schema({
    name: String,
    price: Number,
    category: String,
    status: String,
    stock: Number,
    date: String,
    description: String,
    image: Array,
    access: Boolean,
    reviews: {
        overall: {
            type: Object,
            default: {}
        },
        reviews: Array
    },
    questions: Array
})

module.exports.categorymodel = db.model('category', categoryModel)
module.exports.itemmodel = db.model('products', itemModel)
