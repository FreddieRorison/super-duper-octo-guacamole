const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();
const config = require("./config.json");
const pug = require('pug');
var mysql = require('mysql');

app.use(session({
    secret: 'test',
    cookie: {maxAge: 365*24*60*60*1000},
    saveUninitialized: false
}));

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
    if (Authed(req)) {
        connection.query('SELECT SectionID, Name FROM healthsections;', function (err, results, fields) {
            res.send(pug.renderFile(__dirname + "/src/templates/home.pug", {firstname: req.session.Firstname, sections: results}))
        })
    } else {res.redirect('/login')};
});
app.get('/images/patientMonitoringlogo.jpg', (req, res) => {
    res.sendFile(__dirname + "/src/images/patientMonitoringLogo.jpg");
})
app.get('/login', (req, res) => {
    if (!Authed(req)) {res.send(pug.renderFile(__dirname + "/src/templates/login.pug"))} else {res.redirect('/')};
  });
app.get('/register', (req, res) => {
    if (!Authed(req)) {res.send(pug.renderFile(__dirname + "/src/templates/register.pug"))} else {res.redirect('/')};
});
app.get('/Activities/:SectionID/Poop', (req, res) => {
    console.log(req.params);
    res.send('Poop');
})

// POST REQUESTS
//Allows the user to register an account
app.post('/register', (req, res) => {
    var firstname = req.body.firstname;
    var surname = req.body.surname;
    var email = req.body.email;
    var password = req.body.password;
    
    connection.query(`SELECT * FROM Users WHERE email = ?;`, [email], function (err, results, fields) {
        if (results.length > 0) {
            res.send(pug.renderFile(__dirname + "/src/templates/register.pug", {javascript: "alert('User with that email already exists!')"}));
        } else {
            connection.query('INSERT INTO Users (firstname, surname, email, password) VALUES (?,?,?,?);', [firstname,surname,email,password], function (error, result, field) {
                res.redirect('/');
            });
        }
    });
});

app.post('/login', (req, res) => {
    var email = req.body.email;
    var password = req.body.password;

    connection.query('SELECT UserID, Firstname, Surname, Email, Admin FROM users WHERE Email= ?  AND Password= ? ;', [email, password], function (err, result, fields) {
        if (result.length > 0) {
            req.session.UserID = result[0].UserID;
            req.session.Firstname = result[0].Firstname;
            req.session.Surname = result[0].Surname;
            req.session.Email = result[0].Email;
            req.session.Admin = result[0].Admin;
            res.redirect('/')
        } else {
            res.send(pug.renderFile(__dirname + "/src/templates/login.pug", {javascript: "alert('Email/Password incorrect')"}));
        }
    });
});

// Allow the application to listen on selected port
app.listen(port, function() {
    console.log(`Now listening on port ${port}`);
});

function Authed(req) {
    if (req.session.UserID == null || req.session.UserID == "") {
        return false;
    } else {return true;}
}
