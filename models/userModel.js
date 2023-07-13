const mongoose = require('mongoose')
const db = require('../config/db')

let UserSchema = mongoose.Schema({
    name: String,
    email: String,
    password: String,
    phone: Number,
    status: Boolean,
    address: Array,
    wishlist: Array,
    cart: Array,
    details: Object
})

module.exports = db.model('user', UserSchema)