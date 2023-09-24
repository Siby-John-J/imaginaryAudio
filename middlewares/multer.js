const multer = require('multer')

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/img')
    },
    filename: (req, file, cb) => {
        if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            cb(null, file.originalname)
        } else {
            let err = new Error('no other file extenstions allowed')
            err.status = 'unknown files'
            err.statusCode = 500
            
            cb(err)
        }
    }
})

let origin = multer({storage: storage})

module.exports = origin
