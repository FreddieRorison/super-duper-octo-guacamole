const express = require('express')
const app = express()

const port = 80;

// respond with "hello world" when a GET request is made to the homepage
app.get('/', (req, res) => {
  res.sendFile(__dirname + "/html/index.html")
})
app.get('/login', (req, res) => {
    res.sendFile(__dirname + "/html/login.html")
})
app.get('/register', (req, res) => {
    res.sendFile(__dirname + "/html/register.html")
})
app.get('/styles.css', (req, res) => {
    res.sendFile(__dirname + "/html/styles.css")
})
app.get('/images/logo.png', (req, res) => {
    res.sendFile(__dirname + "/html/images/logo.png")
})


app.listen(port, function() {
    console.log(`Now listening on port ${port}`);
});