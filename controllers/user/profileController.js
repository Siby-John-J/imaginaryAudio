
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

module.exports.editProfile = async(req, res) => {
    let ph = Number(req.body.phone)

    let set = await usermodel.updateOne(
        {name: req.session.username},
        { $set: 
            {
                name: req.body.name, 
                phone: ph ,
                email: req.body.email,
                details: {
                    place: req.body.place,
                    age: req.body.age,
                    dob: req.body.dob
                }
            }
        }
    )
    
    req.session.username = req.body.name

    res.redirect('/' + req.session.username + '/profile')
}

module.exports.address = async(req, res) => {
    try {
        let data = await usermodel.findOne({name: req.session.username})

        const address = [
            'firstname',
            'lastname',
            'phone',
            'address',
            'town',
            'region',
            'zip'
        ]
        
        if(req.query.type === 'checkout') {
            res.render('pages/user/profile/mainPage', {page: 'address', 
            data: data, user: req.session.username, type: 'checkout', form: '',
            formdata: null})
        } else {
            res.render('pages/user/profile/mainPage', {page: 'address', 
            data: data, user: req.session.username, type: 'view', form: address,
            formdata: null})
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
            region: req.body.region,
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

let num = 0

module.exports.editAddress = async(req, res) => {
    try {
        let data = await usermodel.findOne({name: req.session.username})
        let index = Number(req.query.num)

        if(index) {
            num = index
        }
        
        const address = [
            'firstname',
            'lastname',
            'phone',
            'address',
            'town',
            'region',
            'zip'
        ]
        
        if(req.query.func === 'show') {
            res.render('pages/user/profile/mainPage', {page: 'address', 
            data: data, user: req.session.username, type: 'view', form: address,
            formdata: data.address[index]})
        }

        if(req.body.firstname) {

            const address = {
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                phone: Number(req.body.phone),
                address: req.body.address,
                town: req.body.town,
                region: req.body.state,
                zip: Number(req.body.zip)
            }

            let set = await usermodel.updateOne(
                { name: req.session.username },
                { $set: {['address.' + num]: address} }
                )

            res.redirect('/' + req.session.username + '/address')
        }

    } catch (error) {
        
    }
}