
const usermodel = require('../../models/userModel')
const addressmodel = require('../../models/addressModel')

module.exports.profile = async(req, res) => {
    try {
        let data = await usermodel.findOne({name: req.session.username})
        if(req.query.type === 'edit') {
            res.render('pages/user/profile/mainPage', {page: 'profile', 
            data: data, content: 'edit'})
        } else {
            res.render('pages/user/profile/mainPage', {page: 'profile', 
            data: data, content: ''})
        }
    } catch (error) {
        
    }
}

module.exports.address = async(req, res) => {
    console.log(req.body)

    try {
        let data = await usermodel.findOne({name: req.session.username})

        if(req.query.type === 'checkout') {
            res.render('pages/user/profile/mainPage', {page: 'address', 
            data: data, user: req.session.username, type: 'checkout'})
        } else {
            res.render('pages/user/profile/mainPage', {page: 'address', 
            data: data, user: req.session.username, type: 'view'})
            }
    } catch (error) {

    }
}

module.exports.addAddress = async(req, res) => {
    try {
        const address = {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            phone: Number(req.body.phone),
            address: req.body.address,
            town: req.body.town,
            region: req.body.state,
            zip: Number(req.body.zip)
        }

        let add_address = await usermodel.updateMany(
            { name: req.session.username },
            { $push: { address: address } }
        )

        res.send('req senede..')
    } catch (error) {
        console.log(error)
    }
}