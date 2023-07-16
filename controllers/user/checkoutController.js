

module.exports.checkout = (req, res) => {
    res.render('pages/home', {user: req.session.username, page: 'checkout'})
}