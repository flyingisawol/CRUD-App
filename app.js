require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')
const session = require('express-session')
const flash = require('express-flash')
const LnurlAuth = require('passport-lnurl-auth');
const mongoDBSession = require('connect-mongodb-session')
const methodOverride = require('method-override')
const { notFoundHandler, errorHandler } = require('./middlewares/error-handlers')

const User = require('./models/users')
const Merchants = require('./models/merchants')
// const authController = require('./controllers/auth')
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

// passport.use(User.createStrategy())
// passport.serializeUser(User.serializeUser())
// passport.deserializeUser(User.deserializeUser())


/* ----------LNURL MIDDLEWARE---------- */

passport.use(new LnurlAuth.Strategy(function(linkingPublicKey, done) {
    const user = { id: linkingPublicKey };
    done(null, user);
}));

app.use(passport.authenticate('lnurl-auth'));

app.get('/', function(req, res) {
    if (!req.user) {
        return res.send('You are not authenticated. To login go <a href="/login">here</a>.');
    }
    res.send('Logged-in');
});

app.get('/',
    function(req, res, next) {
        if (req.user) {
            return res.redirect('/');
        }
        next();
    },
    new LnurlAuth.Middleware({
        // The externally reachable URL for the lnurl-auth middleware.
        // It should resolve to THIS endpoint on your server.
        callbackUrl: 'http://localhost:3000/login.html',
        // The URL of the "Cancel" button on the login page.
        // When set to NULL or some other falsey value, the cancel button will be hidden.
        cancelUrl: '/',
        // Instruction text shown below the title on the login page:
        instruction: 'Scan the QR code to login',
        // The file path to the login.html template:
        loginTemplateFilePath: 'views/login.html',
        // The number of seconds to wait before refreshing the login page:
        refreshSeconds: 5,
        // The title of the login page:
        title: 'Login with lnurl-auth',
        // The URI schema prefix used before the encoded LNURL.
        // e.g. "lightning:" or "LIGHTNING:" or "" (empty-string)
        uriSchemaPrefix: 'LIGHTNING:',
        // Options object passed to QRCode.toDataURL(data, options) - for further details:
        // https://github.com/soldair/node-qrcode/#qr-code-options
        qrcode: {
            errorCorrectionLevel: 'L',
            margin: 2,
            type: 'image/png',
        },
    })
);
/* ----------^^LNURL MIDDLEWARE---------- */

app.use((req, res, next) => {
    console.log(`log from app.js ln58: ${new Date()} ${req.method} ${req.path}`);
    next()
})

app.get('/explode', (req, res) => {
    throw new Error('some error from explode route')
})

app.get('/', (req, res) => {
    res.render('home.ejs')
})

// app.use(authController)
app.use(lnMerchantController)

app.use(errorHandler)
app.use(notFoundHandler)

mongoose.connect(dbURL, () => {
    console.log('connected to db')
})

app.listen(PORT, () => {
    console.log('listening', PORT);
})