const mongoose = require('mongoose')
const db = require('../config/db')

const adminSchema = mongoose.Schema({
    email: String,
    password: String,
})

module.exports = db.model('admin', adminSchema)

