const mongoose = require('mongoose')
const db = require('../config/db')

let address = mongoose.Schema({
    firstname: String,
    lastname: String,
    email: String,
    phone: Number,
    address: String,
    town: String,
    region: String,
    zip: Number
})

module.exports = db.model('addresses', address)