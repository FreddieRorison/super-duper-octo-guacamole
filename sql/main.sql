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