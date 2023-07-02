
const db = require('../config/db')
const mongoose = require('mongoose')

const cartSchema = mongoose.Schema({
    product: Object,
    count: Number
})

const cart = db.model('cart', cartSchema)

module.exports = cart
