const express = require('express')
const app = express()

const port = 80;

app.set('view engine', 'pug')

app.get('/', (req, res) => {
  res.sendFile(__dirname + "/html/index.html")
})
app.get('/login', (req, res) => {
    res.render(__dirname + "/src/templates/login.pug")
})
app.get('/register', (req, res) => {
    res.render(__dirname + "/src/templates/register.pug")
})
app.get('/images/logo.png', (req, res) => {
    res.sendFile(__dirname + "/src/images/logo.png")
})

app.listen(port, function() {
    console.log(`Now listening on port ${port}`);
});