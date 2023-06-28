const usermodel = require('../../models/userModel')

async function loadUserData(user) {
    return await usermodel.findOne({name: user})
}

module.exports.blockUser = async(data, req, res) => {
    console.log(res)    
    try {
        const loadData = await loadUserData(data)
        if(loadData.status === false) {
            console.log(res)
        }
    } catch (err) {
        res.status(500).send('internal error')
    }
}

