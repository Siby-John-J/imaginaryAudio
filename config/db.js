const mongoose = require('mongoose')
require('dotenv').config()

module.exports = mongoose.createConnection(process.env.MONGO_URL)
