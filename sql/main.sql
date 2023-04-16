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

CREATE TABLE UserSectionLink (
    ID int NOT NULL AUTO_INCREMENT,
    UserID int,
    SectionID int,
    PRIMARY KEY (ID),
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE,
    FOREIGN KEY (SectionID) REFERENCES HealthSections(SectionID) ON DELETE CASCADE
);

CREATE TABLE HealthData (
    RecordID INT NOT NULL AUTO_INCREMENT,
    UserSectionID int,
    BodyTemp int,
    PulseRate int,
    BloodPressure int,
    ResperationRate int,
    ECG int,
    PRIMARY KEY (RecordID),
    FOREIGN KEY (UserSectionID) REFERENCES UserSectionLink(ID) ON DELETE CASCADE
);
CREATE TABLE ExerciseData (
    RecordID INT NOT NULL AUTO_INCREMENT,
    UserSectionID int NOT NULL,
    Duration int,
    Note varchar(255),
    date DateTime,
    PRIMARY KEY (RecordID),
    FOREIGN KEY (UserSectionID) REFERENCES UserSectionLink(ID) ON DELETE CASCADE
);
CREATE TABLE MedicationData (
    RecordID INT NOT NULL AUTO_INCREMENT,
    UserSectionID int,
    Name varchar(255),
    Period int,
    DateTime DATETIME,
    PRIMARY KEY (RecordID),
    FOREIGN KEY (UserSectionID) REFERENCES UserSectionLink(ID) ON DELETE CASCADE
);
CREATE TABLE MentalData (
    RecordID INT NOT NULL AUTO_INCREMENT,
    UserSectionID int,
    Mood int,
    Notes varchar(255),
    DateTime DATETIME,
    PRIMARY KEY (RecordID),
    FOREIGN KEY (UserSectionID) REFERENCES UserSectionLink(ID) ON DELETE CASCADE
);
CREATE TABLE TrackAndTraceData (
    RecordID INT NOT NULL AUTO_INCREMENT,
    UserSectionID int,
    LocationVisited varchar(255),
    ArriveTime DATETIME,
    LeaveTime DATETIME,
    PRIMARY KEY (RecordID),
    FOREIGN KEY (UserSectionID) REFERENCES UserSectionLink(ID) ON DELETE CASCADE
);