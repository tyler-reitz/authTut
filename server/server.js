/* eslint-disable no-console*/
const express = require('express')
const uuid = require('uuid/v4')
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const bodyParser = require('body-parser')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

const users = [ { id: '2f24vvg', email: 'tesst@test.com', password: 'password' } ]

passport.use(new LocalStrategy(
  { usernamField: 'email' },
  (email, password, done) => {
    console.log('Inside local strategy cb')
    const user = users[0]
    if (email === user.email && password === user.password) {
      console.log('Local strategy returned true')
      return done(null, user)
    }
  }
))

passport.serializeUser((user, done) => {
  console.log('Inside serializeUser cb. User id is save to the session file store here.')
  done(null, user.id)
})

const app = express()

// Middlewares
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(session({
  genid: (req) => {
    console.log(`from inside session middleware: ${req.sessionID}`)
    return uuid()
  },
  store: new FileStore(),
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())

// Home Route
app.get('/', (req, res) => {
  console.log(`from inside GET / cb: ${req.sessionID}`)
  res.send(`You hit the homepage son!\n`)
})

// Auth Routes
app.get('/login', (req, res) => {
  console.log(`from inside GET /login cb: ${req.sessionID}`)
  res.send(`You GET the login page\n`)
})

app.post('/login', (req, res, next) => {
  console.log(`from inside POST /login cb: ${req.body}`)
  passport.authenticate('local', (err, user, info) => {
    console.log('Inside passport.authenticate() cb')
    console.log(`req.session.passport: ${JSON.stringify(req.session.passport)}`)
    console.log(`req.user: ${JSON.stringify(req.user)}`)
    req.login(user, err => {
      console.log('Inside req.login() cb')
      console.log(`req.sesson.passport: ${JSON.stringify(req.session.passport)}`)
      console.log(`req.user: ${JSON.stringify(req.user)}`)
      return res.send('You were authenticated & logged inn ')
    })
  })
})
// Listen
app.listen(3000, () => console.log('Listening on 3000'))
