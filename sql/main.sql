DROP DATABASE IF EXISTS HealthApp;

CREATE DATABASE HealthApp;

USE HealthApp;

CREATE TABLE Users (
    UserID INT NOT NULL AUTO_INCREMENT,
    Firstname varchar(255),
    Surname varchar(255),
    Email varchar(255) NOT NULL,
    Password varchar(255) NOT NULL,
    DateOfBirth DATE NOT NULL,
    Admin Boolean DEFAULT false,
    PRIMARY KEY (UserID)
);

CREATE TABLE HealthSection (
    SectionID INT NOT NULL AUTO_INCREMENT,
    Name varchar(255),
    PulseRate Boolean,
    BodyTemp Boolean,
    BloodPressure Boolean,
    ResperationRate Boolean,
    PRIMARY KEY (SectionID)
);

CREATE TABLE HealthActivity (
    ActivityID INT NOT NULL AUTO_INCREMENT,
    UserID INT,
    SectionID INT,
    date DATETIME,
    PRIMARY KEY (ActivityID),
    FOREIGN KEY (SectionID) REFERENCES HealthSection(SectionID) ON DELETE CASCADE,
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE
);

CREATE TABLE PulseRateRecord (
    RecordID INT NOT NULL AUTO_INCREMENT,
    PulseRate INT,
    ActivityID INT,
    PRIMARY KEY (RecordID),
    FOREIGN KEY (ActivityID) REFERENCES HealthActivity(ActivityID) ON DELETE CASCADE
);

CREATE TABLE BodyTemperatureRecord (
    RecordID INT NOT NULL AUTO_INCREMENT,
    BodyTemperature INT,
    ActivityID INT,
    PRIMARY KEY (RecordID),
    FOREIGN KEY (ActivityID) REFERENCES HealthActivity(ActivityID) ON DELETE CASCADE
);

CREATE TABLE BloodPressureRecord (
    RecordID INT NOT NULL AUTO_INCREMENT,
    Systollic INT,
    Diastolic INT,
    ActivityID INT,
    PRIMARY KEY (RecordID),
    FOREIGN KEY (ActivityID) REFERENCES HealthActivity(ActivityID) ON DELETE CASCADE
);

CREATE TABLE ResperationRateRecord (
    RecordID INT NOT NULL AUTO_INCREMENT,
    ResperationRate INT,
    ActivityID INT,
    PRIMARY KEY (RecordID),
    FOREIGN KEY (ActivityID) REFERENCES HealthActivity(ActivityID) ON DELETE CASCADE
);

CREATE TABLE ExerciseCategory (
    ID INT NOT NULL AUTO_INCREMENT,
    Name varchar(255),
    PRIMARY KEY (ID)
);

CREATE TABLE ExerciseRecord (
    ID INT NOT NULL AUTO_INCREMENT,
    UserID INT,
    CategoryID INT,
    Duriation INT,
    Date DATETIME,
    Notes varchar(255),
    PRIMARY KEY (ID),
    FOREIGN KEY (CategoryID) REFERENCES ExerciseCategory(ID) ON DELETE CASCADE,
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE
);

CREATE TABLE MedicineType (
    ID INT NOT NULL AUTO_INCREMENT,
    Name varchar(255),
    PRIMARY KEY (ID)
);

CREATE TABLE MedicationTracker (
    ID INT NOT NULL AUTO_INCREMENT,
    UserID INT,
    MedicineID INT,
    Period INT,
    Dosage INT,
    PRIMARY KEY (ID),
    FOREIGN KEY (MedicineID) REFERENCES MedicineType(ID) ON DELETE CASCADE,
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE
);

INSERT INTO Users (Firstname, Surname, Email, Password, DateOfBirth) VALUES ("Freddie", "Poop", "test@test.com", "farting", "2023-03-02");

INSERT INTO HealthSection (Name, PulseRate, BodyTemp, BloodPressure, ResperationRate) VALUES ("Silly Goofy ah ah", 1,1,0,1);
INSERT INTO HealthActivity (UserID, SectionID, date) VALUES (1,1,"2022-1-1");
INSERT INTO BodyTemperatureRecord (BodyTemperature, ActivityID) VALUES (39,1);
INSERT INTO PulseRateRecord (PulseRate, ActivityID) VALUES (85,1);
INSERT INTO ResperationRateRecord (ResperationRate, ActivityID) VALUES (15,1);

INSERT INTO HealthActivity (UserID, SectionID, date) VALUES (1,1,"2022-2-1");
INSERT INTO BodyTemperatureRecord (BodyTemperature, ActivityID) VALUES (40,2);
INSERT INTO PulseRateRecord (PulseRate, ActivityID) VALUES (87,2);
INSERT INTO ResperationRateRecord (ResperationRate, ActivityID) VALUES (17,2);

INSERT INTO HealthSection (Name, PulseRate, BodyTemp, BloodPressure, ResperationRate) VALUES ("BP gooooooo", 1,1,1,1);
INSERT INTO HealthActivity (UserID, SectionID, date) VALUES (1,2,"2022-1-1");
INSERT INTO BodyTemperatureRecord (BodyTemperature, ActivityID) VALUES (39,2);
INSERT INTO PulseRateRecord (PulseRate, ActivityID) VALUES (85,2);
INSERT INTO ResperationRateRecord (ResperationRate, ActivityID) VALUES (15,2);
INSERT INTO BloodPressureRecord (Systollic, Diastolic, ActivityID) VALUES (120,80,2);