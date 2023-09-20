let { itemmodel } = require('../../models/productsModel')

module.exports.setReview = async(req, res) => {
    let reviews = null
    let overall = {}

    try {
        const getitem = await itemmodel.findOne({ name: req.body.item }, { reviews: 1 })
        
        if(req.body.comment !== '' && req.body.rating !== '') {
            let v = req.body.rating
            overall[`${v}`] = 1
            reviews = {
            user: req.session.username,
                date: 'now',
                rating: Number(req.body.rating),
                content: req.body.comment
            }
        }
        
        const data = {
            overall: overall,
            reviews: reviews
        }
        
        if(getitem.reviews.reviews[0] !== undefined) {
            const setitem = await itemmodel.updateOne(
                { name: req.body.item },
                { $push : { 'reviews.reviews' : reviews } }
            )
            const setitem2 = await itemmodel.updateOne(
                { name: req.body.item },
                { $set : { 'reviews.overall' : overall } }
            )
        } else {
            const setitem = await itemmodel.updateOne(
                { name: req.body.item },
                { $set : { reviews : data } }
            )
        }
        
        res.redirect('/' + req.session.username + '/' + req.body.item)
    } catch (error) {
        console.log(error)
    }
}

// module.exports.getReview = async(req, res) => {
//     let getreview = await itemmodel.findOne({name: 'kontact i8'}, { review: 1 })
//     console.log(getreview)
// }
