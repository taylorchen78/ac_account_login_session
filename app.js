const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const session = require("express-session")
const loginCheck = require('./loginCheck')

const app = express()
const port = 3000

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 3 * 60 * 1000
  }
}))

app.get('/', (req, res) => {
  const session = req.session;
  console.log(session)

  if (session.loginUser) {
    const user = session.loginUser
    res.redirect(`/${user}`)
  } else {
    res.render('index')
  }
})

app.post('/login', (req, res) => {
  const { email, password } = req.body
  const result = loginCheck(email, password)

  if (result !== 'loginFail') {
    req.session.loginUser = result;
    res.redirect(`/${result}`)
  } else {
    const error = 'Email/Password fail, please try again!'
    res.render('index', { error })
  }
})

app.get('/:user', (req, res) => {
  const user = req.params.user
  res.render('welcome', { user })
})

app.post('/logout', (req, res) => {
  req.session.destroy()
  res.redirect('/');
})

app.listen(port, () => {
  console.log(`Express app listening on port ${port}.`)
})