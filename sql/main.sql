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
    Height INT,
    Weight DOUBLE,
    Gender varchar(255),
    Admin Boolean DEFAULT false,
    PRIMARY KEY (UserID)
);

CREATE TABLE PhysicalData (
    RecordID INT NOT NULL AUTO_INCREMENT,
    HeartRate INT,
    Temperature INT,
    BloopPressure INT,
    dates date,
    UserID INT NOT NULL,
    PRIMARY KEY (RecordID)
);

CREATE TABLE ExerciseData (
    RecordID INT NOT NULL AUTO_INCREMENT,
    Duriation DOUBLE,
    TypeID INT,
    Notes varchar(255),
    dates date,
    UserID INT NOT NULL,
    PRIMARY KEY (RecordID)
);

CREATE TABLE MentalHealthData (
    RecordID INT NOT NULL AUTO_INCREMENT,
    Notes varchar(255),
    dates date,
    MoodScore INT(10),
    UserID INT NOT NULL,
    PRIMARY KEY (RecordID)
);

CREATE TABLE ExerciseTypes (
    TypeID INT NOT NULL AUTO_INCREMENT,
    Name varchar(255),
    PRIMARY KEY (ExerciseID)
);
