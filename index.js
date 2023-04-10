const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const config = require("./config.json");
const pug = require('pug');
var mysql = require('mysql');

// Port application will listen on
const port = config.port;
var connection = mysql.createConnection({host:config.mysql.hostname,user:config.mysql.username,password:config.mysql.password,database:config.mysql.database});
connection.connect();

//Other stuff
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// GET REQUESTS
// To be changed
app.get('/', (req, res) => {
  res.sendFile(__dirname + "/src/templates/home.pug");
});
app.get('/login', (req, res) => {
    res.send(pug.renderFile(__dirname + "/src/templates/login.pug"));
  });
app.get('/register', (req, res) => {
    res.render(__dirname + "/src/templates/register.pug");
});
app.get('/home', (req, res) => {
    
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

    connection.query(`INSERT INTO users (Firstname, Surname, Email, Password, DateOfBirth) VALUES ('${firstname}','${surname}','${email}', '${password}', '${date}');`);
    res.send("fart");
});

app.post('/login', (req, res) => {
    const body = req.body;
    var email = body.email;
    var password = body.password;

    connection.query(`SELECT `)
});

// Allow the application to listen on selected port
app.listen(port, function() {
    console.log(`Now listening on port ${port}`);
});