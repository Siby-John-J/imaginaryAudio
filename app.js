const express = require('express')
const session = require('express-session')

const adminRouter = require('./router/adminRoute')
const loginRouter = require('./router/loginRoute')
const signupRoute = require('./router/signupRoute')
const homepageRoute = require('./router/homepage/homePageRoute')

const {adminMiddleware} = require('./middlewares/adminMiddleware')
const userMiddleware = require('./middlewares/userMiddleware')

const app = express()

app.set('view engine', 'ejs')
app.use('/', express.static('public'))  
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(session({
    secret: 'hideInfo',
    resave: false,
    saveUninitialized: false
}))

app.use(adminMiddleware)
// app.use(userMiddleware)

app.use('/', loginRouter)
app.use('/', signupRoute)

app.use('/home', homepageRoute)
app.use('/admin', adminRouter)

app.listen(2000)