const mongoose = require('mongoose')
const db = require('../config/db')

const banner = mongoose.Schema({
    number: Number,
    image: String,
    access: Boolean
})

module.exports = db.model('banner', banner)