
const reportmodel = require('../models/salesModel')
const globalTime = require('../controllers/other/dashboardObj')

let sec = 0
let min = 0
let hour = 0

module.exports = timer = async () => {
    setInterval(() => {
        sec += 1
        if(sec === 30) {
            min++
            sec = 0
            console.log('ite half min bro', min)
            globalTime.time = min
        }
    }, 1000)
}
