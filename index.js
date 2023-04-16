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
    if (checkAuthenticated(req,res)) {res.send(pug.renderFile(__dirname + "/src/templates/home.pug", {firstname: req.session.Firstname}))}
});
app.get('/login', (req, res) => {
    if (req.session.Authenticated) {res.redirect('/');return;};
    res.send(pug.renderFile(__dirname + "/src/templates/login.pug"));
  });
app.get('/register', (req, res) => {
    if (req.session.Authenticated) {res.redirect('/');return;};
    res.render(__dirname + "/src/templates/register.pug");
});
app.get('/HealthActivitiesMenu', (req, res) => {
    if (!req.session.Authenticated) {res.redirect('/login');return;};

    connection.query('SELECT SectionID, Name FROM healthsection;', function (err, results, fields) {
        if (err) throw err;
        res.send(pug.renderFile(__dirname + "/src/templates/HealthActivitiesMenu.pug", {results}))
    });
})
app.get('/HealthActivity', (req, res) => {
    if (!req.session.Authenticated) {res.redirect('/login');return;};
    const activityId = req.query.id;
    if (!activityId) {res.redirect('/HealthActivitiesMenu')}
    connection.query('SELECT * FROM healthsection, bloodpressurerecord, bodytemperaturerecord, pulseraterecord, resperationrecord HAVING SectionID = ?;', [activityId], function (err, result, fields) {
        console.log(result);
        console.log(fields);
    });;
})
//SELECT * FROM healthactivity, bloodpressurerecord, bodytemperaturerecord, pulseraterecord, resperationraterecord GROUP BY healthactivity.ActivityID HAVING SectionID = 1 ;
// POST REQUESTS
//Allows the user to register an account
app.post('/register', (req, res) => {
    if (req.session.Authenticated) {
        res.redirect('/');
        return;
    }

    const body = req.body;
    var firstname = body.firstname;
    var surname = body.surname;
    var email = body.email;
    var password = body.password;
    var date = body.date;

    connection.query(`INSERT INTO users (Firstname, Surname, Email, Password, DateOfBirth) VALUES ('${firstname}','${surname}','${email}', '${password}', '${date}');`);
    res.redirect('/login');
});

app.post('/login', (req, res) => {
    if (req.session.Authenticated) {
        res.redirect('/');
        return;
    }

    const body = req.body;
    var email = body.email;
    var password = body.password;

    connection.query('SELECT UserID, Firstname FROM users WHERE Email= ?  AND Password= ? ;', [email, password], function (err, result, fields) {
        if (err) throw err;
        if (result.length > 0) {
            req.session.Authenticated = true;
            req.session.UserID = result[0].UserID;
            req.session.Firstname = result[0].Firstname;
            res.redirect('/')
        } else {
            res.send(pug.renderFile(__dirname + "/src/templates/login.pug", {javascript: "alert('Email/Password incorrect')"}));
        }
    });
});
app.post('/RemoveActivity', (req, res) => {
    var SectionID = req.body.SectionID;
    var ActivityID = req.body.ActivityID;
    
    connection.query('DELETE FROM healthactivity WHERE ActivityID = ? AND UserID = ? AND SectionID = ?', [ActivityID, req.session.UserID, SectionID], function(err, result) {
        if (err) {throw err;}
        res.redirect('/HealthActivity/?id='+SectionID);
    });
})

function checkAuthenticated(req, res) {
    if (!req.session.Authenticated) {
        res.redirect('/login');
    } else {
        return true;
    }
}

// Allow the application to listen on selected port
app.listen(port, function() {
    console.log(`Now listening on port ${port}`);
});

/*app.get('/HealthActivity', (req, res) => {
    if (!req.session.Authenticated) {res.redirect('/login');return;};
    const activityId = req.query.id;
    if (!activityId) {res.redirect('/HealthActivitiesMenu')}
    connection.query('SELECT * FROM healthsection WHERE SectionID = ? ;', [activityId], function (err, result, fields) {
        var string1 = 'healthactivity.ActivityID,';
        var string2 = 'healthactivity,';
        if (result[0].PulseRate == 1) {
            string1 = string1 + 'PulseRate,';
            string2 = string2 + 'pulseraterecord,'
        }
        if (result[0].BodyTemp == 1) {
            string1 = string1 + 'BodyTemperature,';
            string2 = string2 + 'bodytemperaturerecord,'
        }
        if (result[0].BloodPressure == 1) {
            string1 = string1 + 'Systollic, Diastolic,';
            string2 = string2 + 'bloodpressurerecord,'
        }
        if (result[0].ResperationRate == 1) {
            string1 = string1 + 'resperationrate,';
            string2 = string2 + 'resperationraterecord,'
        }
        string1 = string1.slice(0, string1.length-1);
        string2 = string2.slice(0, string2.length-1);
        var name = result[0].Name;
        sql = `SELECT ${string1} FROM ${string2} WHERE SectionID = ${activityId} GROUP BY healthactivity.ActivityID;`;
        connection.query(sql, function(err, results, fields) {
            res.send(pug.renderFile(__dirname + "/src/templates/HealthActivity.pug", {fields,results, name, activityId}))
        });
    });;
}) */