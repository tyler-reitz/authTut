const express = require('express')
const uuid = require('uuid/v4')
const session = require('express-session')
const FileStore = require('session-file-store')(session)

const app = express()

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

app.get('/', (req, res) => {
  console.log(`from inside / callback: ${req.sessionID}`)
  res.send(`You hit the homepage son!\n`)
})

app.listen(3000, () => console.log('Listening on 3000'))
