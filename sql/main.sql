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
    RecordID INT,
    date DATETIME,
    PRIMARY KEY (ActivityID),
    FOREIGN KEY (SectionID) REFERENCES HealthSection(SectionID),
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

CREATE TABLE PulseRateRecord (
    RecordID INT NOT NULL AUTO_INCREMENT,
    PulseRate INT,
    ActivityID INT,
    PRIMARY KEY (RecordID),
    FOREIGN KEY (ActivityID) REFERENCES HealthActivity(ActivityID)
);

CREATE TABLE BodyTemperatureRecord (
    RecordID INT NOT NULL AUTO_INCREMENT,
    BodyTemperature INT,
    ActivityID INT,
    PRIMARY KEY (RecordID),
    FOREIGN KEY (ActivityID) REFERENCES HealthActivity(ActivityID)
);

CREATE TABLE BloodPressureRecord (
    RecordID INT NOT NULL AUTO_INCREMENT,
    Systollic INT,
    Diastolic INT,
    ActivityID INT,
    PRIMARY KEY (RecordID),
    FOREIGN KEY (ActivityID) REFERENCES HealthActivity(ActivityID)
);

CREATE TABLE ResperationRateRecord (
    RecordID INT NOT NULL AUTO_INCREMENT,
    ResperationRate INT,
    ActivityID INT,
    PRIMARY KEY (RecordID),
    FOREIGN KEY (ActivityID) REFERENCES HealthActivity(ActivityID)
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
    FOREIGN KEY (CategoryID) REFERENCES ExerciseCategory(ID),
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
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
    FOREIGN KEY (MedicineID) REFERENCES MedicineType(ID),
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);