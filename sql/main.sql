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

CREATE TABLE HealthData (
    RecordID INT NOT NULL AUTO_INCREMENT,
    UserID int,
    SectionID int,
    BodyTemp int,
    PulseRate int,
    BloodPressure int,
    ResperationRate int,
    ECG int,
    PRIMARY KEY (RecordID),
    FOREIGN KEY (SectionID) REFERENCES HealthSections(SectionID) ON DELETE CASCADE,
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE
);
CREATE TABLE ExerciseData (
    RecordID INT NOT NULL AUTO_INCREMENT,
    UserID int,
    SectionID int,
    Duration int,
    Note varchar(255),
    date DATE,
    PRIMARY KEY (RecordID),
    FOREIGN KEY (SectionID) REFERENCES HealthSections(SectionID) ON DELETE CASCADE,
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE
);
CREATE TABLE Reminders (
    ReminderID INT NOT NULL AUTO_INCREMENT,
    UserID int,
    SectionID int,
    Name varchar(255),
    Date DATE,
    Repeatit Boolean,
    Period int,
    PRIMARY KEY (ReminderID),
    FOREIGN KEY (SectionID) REFERENCES HealthSections(SectionID) ON DELETE CASCADE,
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE
);
CREATE TABLE MentalData (
    RecordID INT NOT NULL AUTO_INCREMENT,
    UserID int,
    SectionID int,
    Mood int,
    Notes varchar(255),
    DateTime DATETIME,
    PRIMARY KEY (RecordID),
    FOREIGN KEY (SectionID) REFERENCES HealthSections(SectionID) ON DELETE CASCADE,
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE
);
CREATE TABLE TrackAndTraceData (
    RecordID INT NOT NULL AUTO_INCREMENT,
    UserID int,
    SectionID int,
    LocationVisited varchar(255),
    ArriveTime DATETIME,
    LeaveTime DATETIME,
    PRIMARY KEY (RecordID),
    FOREIGN KEY (SectionID) REFERENCES HealthSections(SectionID) ON DELETE CASCADE,
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE
);