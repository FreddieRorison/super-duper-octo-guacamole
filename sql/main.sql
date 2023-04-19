DROP DATABASE IF EXISTS HealthApp;

CREATE DATABASE HealthApp;

USE HealthApp;

CREATE TABLE Users (
    UserID INT NOT NULL AUTO_INCREMENT,
    Firstname varchar(255),
    Surname varchar(255),
    Email varchar(255) NOT NULL,
    Password varchar(255) NOT NULL,
    Admin Boolean DEFAULT false,
    PRIMARY KEY (UserID)
);
CREATE TABLE HealthSections (
    SectionID INT NOT NULL AUTO_INCREMENT,
    Name varchar(255),
    SensoryData Boolean,
    MentalData Boolean,
    DiseaseData Boolean,
    PRIMARY KEY (SectionID)
);
CREATE TABLE SectionUserLink (
    ID INT NOT NULL AUTO_INCREMENT,
    SectionID int,
    UserID int,
    PRIMARY KEY (ID),
    FOREIGN KEY (SectionID) REFERENCES HealthSections(SectionID) ON DELETE CASCADE,
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE
);
CREATE TABLE HealthData (
    RecordID INT NOT NULL AUTO_INCREMENT,
    ID int,
    BodyTemp int,
    PulseRate int,
    BloodPressure int,
    ResperationRate int,
    ECG int,
    PRIMARY KEY (RecordID),
    FOREIGN KEY (ID) REFERENCES SectionUserLink(ID) ON DELETE CASCADE
);
CREATE TABLE ExerciseData (
    RecordID INT NOT NULL AUTO_INCREMENT,
    ID int,
    Duration int,
    Note varchar(255),
    date DATE,
    PRIMARY KEY (RecordID),
    FOREIGN KEY (ID) REFERENCES SectionUserLink(ID) ON DELETE CASCADE
);
CREATE TABLE Reminders (
    ReminderID INT NOT NULL AUTO_INCREMENT,
    ID int,
    Name varchar(255),
    date DATE,
    Repeatit Boolean,
    Period int,
    PRIMARY KEY (ReminderID),
    FOREIGN KEY (ID) REFERENCES SectionUserLink(ID) ON DELETE CASCADE
);
CREATE TABLE MentalNotes (
    NoteID INT NOT NULL AUTO_INCREMENT,
    ID int,
    Notes varchar(255),
    date DATE,
    PRIMARY KEY (NoteID),
    FOREIGN KEY (ID) REFERENCES SectionUserLink(ID) ON DELETE CASCADE
);
CREATE TABLE MentalCheckIn (
    CheckInID INT NOT NULL AUTO_INCREMENT,
    ID int,
    MoodScore int,
    date DATE,
    PRIMARY KEY (CheckInID),
    FOREIGN KEY (ID) REFERENCES SectionUserLink(ID) ON DELETE CASCADE
);
CREATE TABLE Locations (
    ID INT NOT NULL AUTO_INCREMENT,
    Name varchar(255),
    PRIMARY KEY (ID)
);
CREATE TABLE LocationCheckIn (
    CheckInID INT NOT NULL AUTO_INCREMENT,
    ID int,
    Location int,
    date DATE,
    Infected Boolean,
    PRIMARY KEY (CheckInID),
    FOREIGN KEY (ID) REFERENCES SectionUserLink(ID) ON DELETE CASCADE,
    FOREIGN KEY (Location) REFERENCES Locations(ID) ON DELETE CASCADE
);

INSERT INTO Users (UserID, Firstname, Surname, Email, Password, Admin) VALUES (1, 'Freddie', 'Rorison', 'freddieror@gmail.com', 'Password1', 1);
INSERT INTO Users (UserID, Firstname, Surname, Email, Password, Admin) VALUES (2,'Papa', 'John', 'papajohn@aol.com', 'EzPeasy2Pasta988', 0);
INSERT INTO Users (UserID, Firstname, Surname, Email, Password, Admin) VALUES (3,'Julius', 'Oppenheimer', 'atom@pentagon.com', 'BecomeDeath985', 0);

INSERT INTO HealthSections (SectionID, Name, SensoryData, MentalData, DiseaseData) VALUES (1, 'Everything Section', 1,1,1);
INSERT INTO HealthSections (SectionID, Name, SensoryData, MentalData, DiseaseData) VALUES (2, 'Partial Section', 1,0,1);
INSERT INTO HealthSections (SectionID, Name, SensoryData, MentalData, DiseaseData) VALUES (3, 'Scarce Section', 0,1,0);

INSERT INTO SectionUserLink (SectionID, UserID) VALUES (1,1);
INSERT INTO SectionUserLink (SectionID, UserID) VALUES (2,1);
INSERT INTO SectionUserLink (SectionID, UserID) VALUES (3,1);

INSERT INTO SectionUserLink (SectionID, UserID) VALUES (1,2);
INSERT INTO SectionUserLink (SectionID, UserID) VALUES (2,2);
INSERT INTO SectionUserLink (SectionID, UserID) VALUES (3,2);

INSERT INTO SectionUserLink (SectionID, UserID) VALUES (1,3);
INSERT INTO SectionUserLink (SectionID, UserID) VALUES (2,3);
INSERT INTO SectionUserLink (SectionID, UserID) VALUES (3,3);