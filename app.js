require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')
const session = require('express-session')
const flash = require('express-flash')
const mongoDBSession = require('connect-mongodb-session')
const methodOverride = require('method-override')
const { notFoundHandler, errorHandler } = require('./middlewares/error-handlers')

const User = require('./models/users')
const Merchants = require('./models/merchants')
const authController = require('./controllers/auth')
const lnMerchantController = require('./controllers/merchants')


const app = express()
const PORT = process.env.PORT
const dbURL = process.env.MONGODB_URL
const MongoDBStore = mongoDBSession(session)
const sessionStore = new MongoDBStore({
    uri: dbURL,
    collection: 'sessions'
})


//GLOBAL MIDDLEWEAR
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore
}))

app.use(flash())
app.use(passport.initialize())
app.use(passport.session())

passport.use(User.createStrategy())
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
    console.log(`${new Date()} ${req.method} ${req.path}`);
    next()
})

app.get('/explode', (req, res) => {
    throw new Error('some error from explode route')
})

app.get('/', (req, res) => {
    res.render('home.ejs')
})

app.use(authController)
app.use(lnMerchantController)

app.use(errorHandler)
app.use(notFoundHandler)

mongoose.connect(dbURL, () => {
    console.log('connected to db')
})

app.listen(process.env.PORT || 3000, () => {
    console.log('listening', process.env.PORT );
})