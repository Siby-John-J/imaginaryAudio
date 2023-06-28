
const usermodel = require('../../models/userModel')
// const { isadminlogin, adminMiddleware } = require('../../middlewares/adminMiddleware')
const { categorymodel, itemmodel } = require('../../models/productsModel')

module.exports.mainpage = (req, res) => {
    res.render('pages/admin/mainpage')
}

module.exports.dashboard = (req, res) => {
    // adminMiddleware()
    // isadminlogin = req.session.isAdminLogin

    if(isadminlogin) {
        res.render('pages/admin/mainpage', {page: "dashboard"})
    } else {
        res.redirect('/admin/login')
    }
}

module.exports.customers = (req, res) => {
    console.log(req.query)
    if(!isadminlogin) {
        res.redirect('/admin/login')
    } else {
        usermodel.find({}, {}).then(data => {
            res.render('pages/admin/mainpage', {page: "customers", content: data})
        })
    }
}

// module.exports.products = (req, res) => {
//     // console.log('here man')
//     if(!isadminlogin) {
//         res.redirect('/admin/login')
//     } else {
//         itemmodel.find({}).then(data => {
//             calculate().then(data1 => {
//                 // console.log(data)
//                 res.render('pages/admin/mainpage', {page: "products", data: data, countes: data1})
//             })
//         })
//     }
//     calculate()
    
//     async function calculate() {
//         let totalProd = await itemmodel.find({}).count()
//         let category = await categorymodel.find({}).count()
        
//         return [totalProd, category]
//     }
// }

module.exports.category = async (req, res) => {
    let ar = [];
  
    if (!isadminlogin) {
      res.redirect('/admin/login')
    } else {
      try {
        const catPromise = categorymodel.find({})
        const itemPromise = itemmodel.aggregate([
          { $group: { _id: '$category', totalStock: { $sum: '$stock' } } },
          { $project: { _id: 0, totalStock: 1 } }
        ])
  
        const [cat, item] = await Promise.all([catPromise, itemPromise])
        
        let j = 0;
        await render();

        async function render() {
          for (let i of cat) {
            // console.log(item)
            // categorymodel.findOneAndUpdate(
            //   { name: i.name },
            //   { $set: { stock: item[j].stock } }
            // )
            j++;
          }
        }
  
        const model = await categorymodel.find({});
  
        if (req.query.color === 'green') {
          res.render('pages/admin/mainpage', { page: "category", data: model, color: 'red' });
        } else {
          res.render('pages/admin/mainpage', { page: "category", data: model, color: 'green' });
        }
      } catch (error) {
        // console.error(error)
        // Handle the error accordingly, such as displaying an error page or sending an error response
      }
    }
  }
  

// module.exports.category = async(req, res) => {
//     let ar = [];

//     if (!isadminlogin) {
//         res.redirect('/admin/login');
//     } else {
//         const catPromise = categorymodel.find({});
        
//         const [cat, item] = await Promise.all([catPromise, itemmodel.aggregate([
//             { $group: { _id: '$category', totalStock: { $sum: '$stock' } } },
//             { $project: { _id: 0, totalStock: 1 } }
//         ])]);
        
//         let j = 0
//         let model = null
//         render()
//         async function render() {
//             for(let i of cat) {
//                 await categorymodel.findOneAndUpdate(
//                     { name: i.name },
//                     { $set: { stock : item[j].stock } }
//                     )
//                     j++
//                 }
//             }
//             // console.log(item)
//             model = await categorymodel.find({})
//             if(req.query.color === 'green') {
//                 res.render('pages/admin/mainpage', {page: "category", data: model, color: 'red'})
//             } else {
//                 res.render('pages/admin/mainpage', {page: "category", data: model, color: 'green'})
//             }
//         }
// }

module.exports.setCategory = (req, res) => {
    if(req.body.addcat === '') {
        // res.redirect('/admin/category')
    } else if(req.body.action || req.body.control) {
        if(req.body.action) {
            const [item, count] = req.body.action.split(',')
            
            if(count === 'min') {
                categorymodel.findOneAndUpdate(
                    {name: item},
                    {$inc: {stock: -1}}
                    ).then(data => {})
                } else if(count === 'max') {
                    categorymodel.findOneAndUpdate(
                    {name: item},
                    {$inc: {stock: 1}}
                ).then(data => {})
            }
        } else if(req.body.control) {
            const [item, action] = req.body.control.split(',')
            
            itemmodel.deleteMany({
                category: item
            }).then(dat => {})

            categorymodel.deleteOne({
                name: item
            }).then(data => {
                console.log(data)
            })
        }
    } else {
        categorymodel.findOne({
            name: req.body.addcat
        }).then(data => {
            if(data === null) {
                categorymodel.insertMany([{
                    name: req.body.addcat,
                    stock: 1,
                    active: true
                }])
            }
        })
    }
    res.redirect('/admin/category')
}

// module.exports.authProduct = (req, res) => {
//     console.log('hey man..')
//     let formats = []
//     let date = new Date()
//     let newdate = date.getDay().toString() + '-' + date.getMonth().toString() 
//     + '-' + date.getFullYear().toString()
//     req.body.date = newdate
    
//     for(let i in req.body) {
//         if(i === 'pname') {
//             break
//         } else if(req.body[i] === '') {
//             continue
//         } else {
//             const regex = req.body[i].match(/\.([^.]+)$/)[1]
//             formats.push(regex)
//         }
//     }

//     function accessToimg(formats) {
//         for(i of formats) {
//             if(i !== 'jpg' && i !== 'png') {
//                 res.redirect('/admin/addproduct')
//                 return
//             }
//         }
//         res.redirect('/admin/products')
//     }
//     accessToimg(formats)
//     // console.log(req.body)

//     itemmodel.insertMany([{
//         name: req.body.pname,
//         price: Number(req.body.pprice),
//         category: req.body.pcat,
//         image: req.body.imageUpload,
//         description: req.body.pdesc,
//         date: newdate,
//         stock: req.body.pstock,
//         status: 'in stock'
//     }]).then(data => {})
// }
