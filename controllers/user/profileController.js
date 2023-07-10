
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
    try {
        let data = await usermodel.findOne({name: req.session.username})

        console.log(data.address)

        if(req.query.type === 'checkout') {
            res.render('pages/user/profile/mainPage', {page: 'address', 
            data: data, user: req.session.username, type: 'checkout', form: ''})
        } else {
            res.render('pages/user/profile/mainPage', {page: 'address', 
            data: data, user: req.session.username, type: 'view', form: data.address[0]})
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

        res.redirect('/' + req.session.username + '/address')
    } catch (error) {
        console.log(error)
    }
}

module.exports.removeAddress = async(req, res) => {
    try {
        const position = Number(req.query.pos)
        
        let del_address = await usermodel.updateOne(
            { name: req.session.username },
            { $pull: { address: {zip: position} } }
        )
        
        res.redirect('/' + req.session.username + '/address')
    } catch (error) {
        
    }
}

module.exports.editAddress = async(req, res) => {
    try {
        const dat = req.query.data
        
        let edit_address = await usermodel.findOne(
            { name: req.session.username },
            { address: dat }
        )

        res.redirect('/' + req.session.username + '/address')
    } catch (error) {
        
    }
}
