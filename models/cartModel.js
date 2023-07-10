
const db = require('../config/db')
const mongoose = require('mongoose')

const cartSchema = mongoose.Schema({
    user: Object,
    products: Array
})

const cart = db.model('cart', cartSchema)

module.exports = cart
