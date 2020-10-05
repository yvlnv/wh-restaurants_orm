const express = require('express')
const expressHandlebars = require('express-handlebars')
const Handlebars = require('handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const app = express()

const handlebars = expressHandlebars({
    handlebars: allowInsecurePrototypeAccess(Handlebars)
})

app.use(express.static('public'))
app.engine('handlebars', handlebars)
app.set('view engine', 'handlebars')

app.get('/', (req, res) => {
    res.render('restaurants', {date: new Date()})
})

app.get('/about', (req, res) => {
    res.render('about', {name: 'Yana'})
})

app.get('/restaurant1', (req, res) => {
    res.render('restaurant1')
})

app.listen(3000, () => {
    console.log('Web server is running')
})