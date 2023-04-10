const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const config = require("./config.json");
var mysql = require('mysql');

// Port application will listen on
const port = config.port;
var connection = mysql.createConnection({host:config.mysql.hostname,user:config.mysql.username,password:config.mysql.password,database:config.mysql.database});
//Other stuff
app.set('view engine', 'pug');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// GET REQUESTS
// To be changed
app.get('/', (req, res) => {
  res.sendFile(__dirname + "/html/index.html");
});
app.get('/login', (req, res) => {
    res.render(__dirname + "/src/templates/login.pug");
});
app.get('/register', (req, res) => {
    res.render(__dirname + "/src/templates/register.pug");
});
app.get('/images/logo.png', (req, res) => {
    res.sendFile(__dirname + "/src/images/logo.png");
});

// POST REQUESTS

//Allows the user to register an account
app.post('/register', (req, res) => {
    const body = req.body;
    var firstname = body.firstname;
    var surname = body.surname;
    var email = body.email;
    var password = body.password;
    var date = body.date;

    connection.connect();

    connection.query(`INSERT INTO users (Firstname, Surname, Email, Password, DateOfBirth) VALUES ('${firstname}','${surname}','${email}', '${password}', '${date}');`);

    connection.end();

    res.redirect(200, '/login');
});

app.post('/login', (req, res) => {
    const body = req.body;
    console.log(body);
});

// Allow the application to listen on selected port
app.listen(port, function() {
    console.log(`Now listening on port ${port}`);
});