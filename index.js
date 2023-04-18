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
var connection = mysql.createConnection({host:config.mysql.hostname,user:config.mysql.username,password:config.mysql.password,database:config.mysql.database,dateStrings: true});
connection.connect();

//Other stuff
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// GET REQUESTS
// To be changed
app.get('/', (req, res) => {
    if (!Authed(req)) {res.redirect('/login'); return;}
    connection.query('SELECT SectionID FROM healthsections;', function (err, results, fields) {
        var i = 0;
        while (i < results.length) {
            connection.query('SELECT ID FROM SectionUserLink WHERE SectionID = ? AND UserID = ?', [results[0].SectionID, req.session.UserID], function (err, result) {
                if (result.length < 1) {
                    connection.query('INSERT INTO SectionUserLink (SectionID, UserID) VALUES (?,?)', [results[0].SectionID, req.session.UserID], function (err, resul) {
                        if (err) throw (err);
                    })
                }
            })
            i++
        }
        connection.query('SELECT HealthSections.Name, SectionUserLink.ID FROM HealthSections, SectionUserLink WHERE SectionUserLink.UserID = ? AND HealthSections.SectionID = SectionUserLink.SectionID;', [req.session.UserID], function (err, result, fields) {
            if (err) {throw err};
            res.send(pug.renderFile(__dirname + "/src/templates/home.pug", {sections: result, firstname: req.session.Firstname}))
        })
    })
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
app.get('/Activities/:SectionID', (req, res) => {
    if (!Authed(req)) {res.redirect('/login'); return;}
    const SectionID = req.params.SectionID;
    connection.query('SELECT SectionID FROM SectionUserLink WHERE ID = ?', [SectionID], function (err, result) {
        connection.query('SELECT Name, SensoryData, MentalData, DiseaseData FROM healthsections WHERE SectionID = ?', [result[0].SectionID], function (err, result, fields) {
            if (result.length <= 0) {res.redirect('/'); return;}
            var activities = []
            var iterator = 0;
            if (result[0].SensoryData == 1) {
                activities[iterator] = {Name: 'Sensory Data', Link: 'SensoryData'}
                iterator = iterator + 1;
            } 
            if (result[0].MentalData == 1) {
                activities[iterator] = {Name: 'Mental Health Data', Link: 'MentalData'}
                iterator = iterator + 1;
            } 
            if (result[0].DiseaseData == 1) {
                activities[iterator] = {Name: 'Disease Data', Link: 'DiseaseData'}
                iterator = iterator + 1;
            }
    
            res.send(pug.renderFile(__dirname + '/src/templates/section.pug', {SectionID: SectionID, activities: activities, SectionName: result[0].Name}))
            })
    })
    
    
})
app.get('/Activities/:SectionID/SensoryData', (req, res) => {
    if (!Authed(req)) {res.redirect('/login'); return;}
    const SectionID = req.params.SectionID;
    connection.query('SELECT Name, Date, Repeatit, Period FROM Reminders WHERE ID = ?', [SectionID], function (err, results, fields) {
        const date = new Date();
        var reminders = []
        var i = 0;
        var iterator = 0;
        while (i < results.length) {
            var split = results[i].Date.split("-");
            var testDate = new Date(split[0], split[1]-1, split[2]);
            var d1 = date.getDate() + '-' + date.getMonth() + '-' + date.getFullYear();
            var d2 = testDate.getDate() + '-' + testDate.getMonth() + '-' + testDate.getFullYear();
            if (d1 == d2) {
                reminders[iterator] = {Name: results[i].Name}
                iterator++
            } else if (!(testDate > date) && (Math.floor((((date.getTime() - testDate.getTime()))/1000/60/60/24)) % results[i].Period) == 0 && results[i].Repeatit == 1) {
                reminders[iterator] = {Name: results[i].Name}
                iterator++
            }
            i++
        }
        res.send(pug.renderFile(__dirname + '/src/templates/sensorydata.pug', {SectionID: SectionID, RemindersToday: reminders}));
    })
})
app.get('/Activities/:SectionID/SensoryData/HealthData', (req, res) => {
    if (!Authed(req)) {res.redirect('/login'); return;}
    const SectionID = req.params.SectionID;

    connection.query('SELECT RecordID, BodyTemp, PulseRate, BloodPressure, ResperationRate, ECG FROM healthdata WHERE ID = ?', [SectionID], function (err, results, fields) {
        res.send(pug.renderFile(__dirname + "/src/templates/healthdata.pug", {results: results}))
    })
})
app.get('/Activities/:SectionID/SensoryData/HealthData/Add', (req, res) => {
    if (!Authed(req)) {res.redirect('/login'); return;}
    const SectionID = req.params.SectionID;

    res.send(pug.renderFile(__dirname + "/src/templates/healthdataAdd.pug"));
})
app.get('/Activities/:SectionID/SensoryData/HealthData/:RecordID/Edit', (req, res) => {
    if (!Authed(req)) {res.redirect('/login'); return;}
    const SectionID = req.params.SectionID;
    const RecordID = req.params.RecordID;

    connection.query('SELECT BodyTemp, PulseRate, BloodPressure, ResperationRate, ECG FROM healthdata WHERE RecordID = ?;', [RecordID], function (err, results, fields) {
        if (results[0] == null) {res.redirect(`/Activities/${SectionID}/SensoryData/HealthData`); return;}
        res.send(pug.renderFile(__dirname + "/src/templates/healthdataEdit.pug", {results: results[0]}));
    })
})
app.get('/Activities/:SectionID/SensoryData/ExerciseData', (req, res) => {
    if (!Authed(req)) {res.redirect('/login'); return;}
    const SectionID = req.params.SectionID;

    connection.query('SELECT RecordID, Duration, Note, Date FROM exercisedata WHERE ID = ? ORDER BY date DESC;', [SectionID], function (err, results, fields) {
        res.send(pug.renderFile(__dirname + "/src/templates/exercisedata.pug", {results: results}))
    })
})
app.get('/Activities/:SectionID/SensoryData/ExerciseData/Add', (req, res) => {
    if (!Authed(req)) {res.redirect('/login'); return;}
    const SectionID = req.params.SectionID;

    res.send(pug.renderFile(__dirname + "/src/templates/exercisedataAdd.pug"));
})
app.get('/Activities/:SectionID/SensoryData/ExerciseData/:RecordID/Edit', (req, res) => {
    if (!Authed(req)) {res.redirect('/login'); return;}
    const SectionID = req.params.SectionID;
    const RecordID = req.params.RecordID;

    connection.query('SELECT duration, note, date FROM ExerciseData WHERE RecordID = ?;', [RecordID], function (err, results, fields) {
        if (results[0] == null) {res.redirect(`/Activities/${SectionID}/SensoryData/ExerciseData`); return;}
        res.send(pug.renderFile(__dirname + "/src/templates/exercisedataEdit.pug", {results: results[0]}));
    })
})
app.get('/Activities/:SectionID/SensoryData/Reminders', (req, res) => {
    if (!Authed(req)) {res.redirect('/login'); return;}
    const SectionID = req.params.SectionID;

    connection.query('SELECT ReminderID, Name, Date, Repeatit, Period FROM reminders WHERE ID = ?', [SectionID], function (err, results, fields) {
        if (err) { throw err;}
        res.send(pug.renderFile(__dirname + "/src/templates/reminders.pug", {results: results}))
    })
})
app.get('/Activities/:SectionID/SensoryData/Reminders/Add', (req, res) => {
    if (!Authed(req)) {res.redirect('/login'); return;}
    const SectionID = req.params.SectionID;

    res.send(pug.renderFile(__dirname + "/src/templates/reminderAdd.pug"));
})
app.get('/Activities/:SectionID/SensoryData/Reminders/:RecordID/Edit', (req, res) => {
    if (!Authed(req)) {res.redirect('/login'); return;}
    const SectionID = req.params.SectionID;
    const RecordID = req.params.RecordID;

    connection.query('SELECT Name, Date, Repeatit, Period FROM reminders WHERE ReminderID = ?;', [RecordID], function (err, results, fields) {
        if (results[0] == null) {res.redirect(`/Activities/${SectionID}/SensoryData/Reminders`); return;}
        res.send(pug.renderFile(__dirname + "/src/templates/reminderEdit.pug", {results: results[0]}));
    })
})
app.get('/Activities/:SectionID/MentalData', (req, res) => {
    if (!Authed(req)) {res.redirect('/login'); return;}
    const SectionID = req.params.SectionID;

    connection.query('SELECT Date FROM MentalCheckIn WHERE ID = ? ORDER BY DATE DESC', [SectionID], function (err, result, fields) {
        const date = new Date();
        if (result[0] == null) {res.send(pug.renderFile(__dirname + "/src/templates/mentalCheckIn.pug")); return;}
        var split = result[0].Date.split("-");
        var testDate = new Date(split[0], split[1]-1, split[2]);
        var d1 = date.getDate() + '-' + date.getMonth() + '-' + date.getFullYear();
        var d2 = testDate.getDate() + '-' + testDate.getMonth() + '-' + testDate.getFullYear();
        if (d1 != d2) {res.send(pug.renderFile(__dirname + "/src/templates/mentalCheckIn.pug")); return;}
        connection.query('SELECT NoteID, Notes, Date FROM MentalNotes WHERE ID = ?', [SectionID], function (err, results, fields) {
            res.send(pug.renderFile(__dirname + "/src/templates/mentalData.pug", {results: results}));
        })
    })
    
})
app.get('/Activities/:SectionID/MentalData/Add', (req, res) => {
    if (!Authed(req)) {res.redirect('/login'); return;}
    const SectionID = req.params.SectionID;
    
    res.send(pug.renderFile(__dirname + "/src/templates/mentalNotesAdd.pug"));
})
app.get('/Activities/:SectionID/MentalData/:RecordID/Edit', (req, res) => {
    if (!Authed(req)) {res.redirect('/login'); return;}
    const SectionID = req.params.SectionID;
    const RecordID = req.params.RecordID;
    
    connection.query('SELECT Notes FROM MentalNotes WHERE NoteID = ?;', [RecordID], function (err, results, fields) {
        if (results[0] == null) {res.redirect(`/Activities/${SectionID}/MentalData`); return;}
        res.send(pug.renderFile(__dirname + "/src/templates/mentalNotesEdit.pug", {results: results[0]}));
    })
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
app.post('/Activities/:SectionID/SensoryData/HealthData/Remove', (req, res) => {
    if (!Authed(req)) {res.redirect('/login'); return;}
    const SectionID = req.params.SectionID;
    const RecordID = req.body.RecordID;

    connection.query('DELETE FROM healthdata WHERE ID = ? AND RecordID = ?;', [SectionID, RecordID], function (err, results, fields) {
        res.send(pug.renderFile(__dirname + "/src/templates/healthdata.pug", {results: results}))
    })
})
app.post('/Activities/:SectionID/SensoryData/HealthData/Add', (req, res) => {
    if (!Authed(req)) {res.redirect('/login'); return;}
    const SectionID = req.params.SectionID;
    const BodyTemp = req.body.BodyTemp;
    const PulseRate = req.body.PulseRate;
    const BloodPressure = req.body.BloodPressure;
    const ResperationRate = req.body.ResperationRate;
    const ECG = req.body.ECG;

    connection.query('INSERT INTO HealthData (ID, BodyTemp, PulseRate, BloodPressure, ResperationRate, ECG) VALUES (?,?,?,?,?,?);', [SectionID, BodyTemp, PulseRate, BloodPressure, ResperationRate, ECG], function (err, results, fields) {
        res.redirect(`/Activities/${SectionID}/SensoryData/HealthData`);
    })
})
app.post('/Activities/:SectionID/SensoryData/HealthData/:RecordID/Edit', (req, res) => {
    if (!Authed(req)) {res.redirect('/login'); return;}
    const SectionID = req.params.SectionID;
    const RecordID = req.params.RecordID;
    const BodyTemp = req.body.BodyTemp;
    const PulseRate = req.body.PulseRate;
    const BloodPressure = req.body.BloodPressure;
    const ResperationRate = req.body.ResperationRate;
    const ECG = req.body.ECG;

    connection.query('UPDATE healthdata SET BodyTemp = ?, PulseRate = ?, BloodPressure = ?, ResperationRate = ?, ECG = ? WHERE RecordID = ?;', [BodyTemp, PulseRate, BloodPressure, ResperationRate, ECG, RecordID], function (err, results, fields ) {
        res.redirect(`/Activities/${SectionID}/SensoryData/HealthData`);
    })

})
app.post('/Activities/:SectionID/SensoryData/ExerciseData/Remove', (req, res) => {
    if (!Authed(req)) {res.redirect('/login'); return;}
    const SectionID = req.params.SectionID;
    const RecordID = req.body.RecordID;

    connection.query('DELETE FROM exercisedata WHERE SectionID = ? AND UserID = ? AND RecordID = ?;', [SectionID, req.session.UserID, RecordID], function (err, results, fields) {
        res.sendStatus(200);
    })
})
app.post('/Activities/:SectionID/SensoryData/ExerciseData/Add', (req, res) => {
    if (!Authed(req)) {res.redirect('/login'); return;}
    const SectionID = req.params.SectionID;
    const Duration = req.body.Duration;
    const Notes = req.body.Notes;
    const Date = req.body.Date;

    connection.query('INSERT INTO ExerciseData (ID, Duration, Note, Date) VALUES (?,?,?,?);', [SectionID, Duration, Notes, Date], function (err, results, fields) {
        res.redirect(`/Activities/${SectionID}/SensoryData/ExerciseData`);
    })
})
app.post('/Activities/:SectionID/SensoryData/ExerciseData/:RecordID/Edit', (req, res) => {
    if (!Authed(req)) {res.redirect('/login'); return;}
    const SectionID = req.params.SectionID;
    const RecordID = req.params.RecordID;
    const Duration = req.body.Duration;
    const Note = req.body.Note;
    const Date = req.body.Date;

    connection.query('UPDATE exercisedata SET duration = ?, note = ?, date = ? WHERE RecordID = ?;', [Duration, Note, Date, RecordID], function (err, results, fields ) {
        if (err) {throw err};
        res.redirect(`/Activities/${SectionID}/SensoryData/ExerciseData`);
    })

})
app.post('/Activities/:SectionID/SensoryData/Reminders/Add', (req, res) => {
    if (!Authed(req)) {res.redirect('/login'); return;}
    const SectionID = req.params.SectionID;
    const Name = req.body.Name;
    const Date = req.body.Date;
    var repeats = false;
    const Period = req.body.Period;
    if (req.body.Repeats == 'on') {repeats = true;}
    
    connection.query('INSERT INTO reminders (ID, Name, Date, repeatit, Period) VALUES (?,?,?,?,?);', [SectionID, Name, Date, repeats, Period], function (err, results, fields) {
        res.redirect(`/Activities/${SectionID}/SensoryData/Reminders`);
    })
})
app.post('/Activities/:SectionID/SensoryData/Reminders/Remove', (req, res) => {
    if (!Authed(req)) {res.redirect('/login'); return;}
    const SectionID = req.params.SectionID;
    const ReminderID = req.body.RecordID;

    connection.query('DELETE FROM reminders WHERE ID = ? AND ReminderID = ?;', [SectionID, ReminderID], function (err, results, fields) {
        res.sendStatus(200)
    })
})
app.post('/Activities/:SectionID/SensoryData/Reminders/:RecordID/Edit', (req, res) => {
    if (!Authed(req)) {res.redirect('/login'); return;}
    const SectionID = req.params.SectionID;
    const RecordID = req.params.RecordID;
    const Name = req.body.Name;
    const Date = req.body.Date;
    var Repeats = false;
    const Period = req.body.Period;
    if (req.body.Repeats == 'on') {Repeats = true;}
    
    connection.query('UPDATE reminders SET Name = ?, Date = ?, repeatit = ?, Period = ? WHERE ReminderID = ?;', [Name, Date, Repeats, Period, RecordID], function (err, results, fields ) {
        if (err) {throw err};
        res.redirect(`/Activities/${SectionID}/SensoryData/Reminders`);
    })

})
app.post('/Activities/:SectionID/MentalData/SubmitCheckIn', (req, res) => {
    if (!Authed(req)) {res.redirect('/login'); return;}
    const SectionID = req.params.SectionID;
    const Number = req.body.Number;

    connection.query('INSERT INTO MentalCheckIn (ID, MoodScore, Date) VALUES (?, ?, NOW())', [SectionID, Number], function (err, results, fields) {
        if (err) {throw err;}
        res.redirect('/Activities/:SectionID/MentalData');
    })
})
app.post('/Activities/:SectionID/MentalData/Remove', (req, res) => {
    if (!Authed(req)) {res.redirect('/login'); return;}
    const SectionID = req.params.SectionID;
    const ReminderID = req.body.RecordID;

    connection.query('DELETE FROM MentalNotes WHERE ID = ? AND NoteID = ?;', [SectionID, ReminderID], function (err, results, fields) {
        res.sendStatus(200)
    })
})
app.post('/Activities/:SectionID/MentalData/Add', (req, res) => {
    if (!Authed(req)) {res.redirect('/login'); return;}
    const SectionID = req.params.SectionID;
    const note = req.body.Note;

    connection.query('INSERT INTO MentalNotes (ID, Notes, Date) VALUES (?,?, NOW());', [SectionID, note], function (err, result, fields) {if(err){throw err;}});

    res.redirect(`/Activities/${SectionID}/MentalData`);
})
app.post('/Activities/:SectionID/MentalData/:RecordID/Edit', (req, res) => {
    if (!Authed(req)) {res.redirect('/login'); return;}
    const SectionID = req.params.SectionID;
    const RecordID = req.params.RecordID;
    const Note = req.body.Note;
    
    connection.query('UPDATE MentalNotes SET Notes = ? WHERE NoteID = ?;', [Note, RecordID], function (err, results, fields ) {
        if (err) {throw err};
        res.redirect(`/Activities/${SectionID}/MentalData`);
    })

})


// Allow the application to listen on selected port
app.listen(port, function() {
    console.log(`Now listening on port ${port}`);
});

function Authed(req) {
    if (req.session.UserID == null || req.session.UserID == "") {
        return false;
    } else {return true;}
}