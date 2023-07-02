const express = require('express')
const session = require('express-session')

const adminRouter = require('./router/adminRoute')
const userRoute = require('./router/homepage/userRoute')
const loginRouter = require('./router/loginRoute')
const signupRoute = require('./router/signupRoute')

const adminMiddleware = require('./middlewares/adminMiddleware')
const errorMiddleware = require('./middlewares/errorMiddleware')
// const userMiddleware = require('./middlewares/userMiddleware')

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

app.use('/', loginRouter)
app.use('/', signupRoute)

app.use('/admin', adminRouter)
app.use('/:id', userRoute)

// app.use(adminLoginMiddleware)
app.use(errorMiddleware)

app.listen(2000)
