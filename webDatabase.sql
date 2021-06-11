
DROP DATABASE `covidTraceDB`;

CREATE DATABASE `covidTraceDB`;

USE `covidTraceDB`;

CREATE TABLE `BasicUser`(
email VARCHAR(255),
firstName VARCHAR(255),
lastName VARCHAR(255),
phoneNum VARCHAR(50),
icPsprt VARCHAR(15),
weeklyHotspotNoti INT,
venueHotspotNoti INT,
PRIMARY KEY(email)
);

CREATE TABLE `Admin`(
email VARCHAR(255),
firstName VARCHAR(255),
lastName VARCHAR(255),
PRIMARY KEY(email)
);

CREATE TABLE `VenueOwner`(
email VARCHAR(255),
firstName VARCHAR(255),
lastName VARCHAR(255),
phoneNum VARCHAR(50),
businessName VARCHAR(15),
checkInCode VARCHAR(10) UNIQUE,
lat FLOAT( 10, 6 ) NOT NULL,
lng FLOAT( 10, 6 ) NOT NULL,
isHotspot INT,
PRIMARY KEY(email)
);

CREATE TABLE `Address`(
id INT AUTO_INCREMENT,
venue VARCHAR(255) UNIQUE,
buildingName VARCHAR(20),
streetName VARCHAR(100),
zipCode VARCHAR(10),
city VARCHAR(20),
country VARCHAR(20),
PRIMARY KEY (id),
FOREIGN KEY (venue) REFERENCES VenueOwner(email)
);

CREATE TABLE `CheckIn`(
id INT AUTO_INCREMENT,
user VARCHAR(255),
venue VARCHAR(255),
time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY (id),
FOREIGN KEY (user) REFERENCES BasicUser(email),
FOREIGN KEY (venue) REFERENCES VenueOwner(email)
);

CREATE TABLE `Hotspots`(
id INT AUTO_INCREMENT,
creator VARCHAR(255),
street VARCHAR(255),
zipCode VARCHAR(10),
city VARCHAR(20),
country VARCHAR(20),
lat FLOAT( 10, 6 ) NOT NULL,
lng FLOAT( 10, 6 ) NOT NULL,
dateAdded TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY(id),
FOREIGN KEY (creator) REFERENCES Admin(email)
);

CREATE TABLE `Security`(
user VARCHAR(255),
password VARCHAR(255),
accountType VARCHAR(10),
PRIMARY KEY (user)
);


-- Sample data to test


INSERT INTO Security VALUES("admin@wdcproject.com","$argon2i$v=19$m=4096,t=3,p=1$LJG5Ew4PYpth0tVx9WHIwg$v5eEq1gk7RTXnLCMSAm4SPGmTc3jhO3Iy7JPvSFtl3k","admin");

INSERT INTO Admin VALUES("admin@wdcproject.com","Admin","Admin");

INSERT INTO Hotspots creator, street, zipCode, city, country, lat, lng VALUES("admin@wdcproject.com","Sunway Monash Residence","47500","Subang Jaya","Malaysia", 3.0632031, 101.599);

INSERT INTO Hotspots creator, street, zipCode, city, country, lat, lng VALUES("admin@wdcproject.com","Sunway Pyramid","47500","Subang Jaya","Malaysia", 3.073222, 101.606767)