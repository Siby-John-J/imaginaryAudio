

module.exports.profile = (req, res) => {
    res.render('pages/user/profile/mainPage', {page: 'profile', user: req.session.username})
}

module.exports.orders = (req, res) => {
    res.render('pages/user/profile/mainPage', {page: 'orders', user: req.session.username})
}

module.exports.address = (req, res) => {
    if(req.query.type === 'checkout') {
        res.render('pages/user/profile/mainPage', {page: 'address', 
        user: req.session.username, type: 'checkout'})
    } else {
        res.render('pages/user/profile/mainPage', {page: 'address', 
        user: req.session.username, type: 'view'})
    }
}