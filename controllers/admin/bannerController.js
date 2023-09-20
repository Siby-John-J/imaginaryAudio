const bannermodel = require('../../models/bannerModel')

module.exports.viewBanner = async(req, res) => {
    try {
        const bannerlist = await bannermodel.find({})
        res.render('pages/admin/mainPage', {page: 'banner', data: bannerlist})
    } catch (error) {
        
    }
}

module.exports.setBanner = async(req, res) => {
    try {        
        if(req.file) {
            const setbanner = await bannermodel.insertMany([
                { number: 1, image: req.file.originalname, access: false },
            ])
        }
        
        res.redirect('/admin/banner')
    } catch (error) {
        
    }
}

module.exports.selectBanner = async(req, res) => {
    const select = await bannermodel.findOneAndUpdate(
        { _id: req.body.id },
        { $set: { access: true } }
    )

    const deselect = await bannermodel.updateMany(
        { _id: { $ne: req.body.id } }, // Exclude the document you just updated
        { $set: { access: false } }
    )
    
    res.json({msg: 'success'})
}

module.exports.deleteBanner = async(req, res) => {
    console.log(req.body)

    const select = await bannermodel.findOne({_id: req.body.id})

    if(select.access) {
        res.json({msg: 'no_delete'})
    } else {
        const deleteBanner = await bannermodel.deleteOne({_id: req.body.id})
        res.redirect('/admin/banner')
        // res.json({msg: 'delete'})
    }

}