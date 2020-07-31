const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const loginCheck = require('./loginCheck')

const app = express()
const port = 3000

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.render('index')
})

app.post('/', (req, res) => {
  const { email, password } = req.body
  const result = loginCheck(email, password)

  if (result !== 'loginFail') {
    res.render('welcome', { result })
  } else {
    const error = 'Email/Password fail, please try again!'
    res.render('index', { error })
  }
})

app.listen(port, () => {
  console.log(`Express app listening on port ${port}.`)
})