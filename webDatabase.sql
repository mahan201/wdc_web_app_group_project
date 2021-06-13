
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
businessName VARCHAR(50),
checkInCode VARCHAR(10) UNIQUE,
lat FLOAT( 10, 6 ) NOT NULL,
lng FLOAT( 10, 6 ) NOT NULL,
isHotspot INT,
PRIMARY KEY(email)
);

CREATE TABLE `Address`(
id INT AUTO_INCREMENT,
venue VARCHAR(255) UNIQUE,
buildingName VARCHAR(50),
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

-- ADMINS
INSERT INTO Security VALUES("admin@wdcproject.com","$argon2i$v=19$m=4096,t=3,p=1$LJG5Ew4PYpth0tVx9WHIwg$v5eEq1gk7RTXnLCMSAm4SPGmTc3jhO3Iy7JPvSFtl3k","admin");
INSERT INTO Admin VALUES("admin@wdcproject.com","Admin","Admin");

INSERT INTO Security VALUES ("admin2@wdcproject.com","$argon2i$v=19$m=4096,t=3,p=1$OCfOcMQx7VFlAamuhubfCw$JjAQKPqBpPpmdF+06wjfDcJr/dks8y4Q3IROcuF0mq8","admin");
INSERT INTO Admin VALUES ("admin2@wdcproject.com","Admin2","Admin2");

-- USERS
-- INSERT INTO Security VALUES ("chris.hemsworth@gmail.com","$argon2i$v=19$m=4096,t=3,p=1$6Zg/hFxZq8qSh7EqpDZlbw$kPin4faWS8ZEzxX1Qmxd9jNhALdN0TS3s01N3h+H11k","user");
-- INSERT INTO BasicUser VALUES ("chris.hemsworth@gmail.com","Chris","Hemsworth","12345678","ABC1234",1,1);

INSERT INTO Security VALUES ("hugh.jackman@gmail.com","$argon2i$v=19$m=4096,t=3,p=1$p/e0FiPtYv6mSARfQRmmaw$muD8OwMIq6LLVKStflWFD3Se6rvoDUEUhLvzH4S4mI4","user");
INSERT INTO BasicUser VALUES ("hugh.jackman@gmail.com","Hugh","Jackman","12345678","ABC1234",1,1);

-- VENUES
INSERT INTO Security VALUES ("adelaide.airport@gmail.com","$argon2i$v=19$m=4096,t=3,p=1$2CgVov3AX9Lp/bPcvFvmaQ$FrG2G0zhJMvIC4Nc1i5TucOUCsJVsCt6LKCapFzWk1M","venue");
INSERT INTO VenueOwner VALUES ('adelaide.airport@gmail.com','Airport','Adelaide','1234567','Adelaide Airport','DLDRPR8064',-34.935284,138.534912,0);
INSERT INTO Address VALUES (1,'adelaide.airport@gmail.com','Adelaide Airport','1 James Schofield Dr','5950','Adelaide','Australia');

INSERT INTO Security VALUES ("adelaideuni@gmail.com","$argon2i$v=19$m=4096,t=3,p=1$o9XoUFdXJRQVpG/+g0VC8g$NLhumRKPRT8H2BY+yfgNnMgn02s69aYvfTIGtdm0MVk","venue");
INSERT INTO VenueOwner Values ('adelaideuni@gmail.com','AdelaideUni','Adelaide','+61883135208','University of Adelaide','NVR318336',-34.918922,138.604233,0);
INSERT INTO Address VALUES (2,'adelaideuni@gmail.com','The University of Adelaide','North Terrace','5005','Adelaide','Australia');

INSERT INTO Security VALUES ('rundle.mall@gmail.com','$argon2i$v=19$m=4096,t=3,p=1$0Pb0F+t7zfZKNKPfG530uQ$taUJ6ojGQT0zQicHOlSg0TOE77zV7mOa5ZkH6Dml6Is','venue');
INSERT INTO VenueOwner Values ('rundle.mall@gmail.com','Rundle','Mall','1234567','Rundle Mall','RNDL671296',-34.922489,138.601501,0);
INSERT INTO Address VALUES (3,'rundle.mall@gmail.com','Rundle Mall Plaza','50 Rundle Mall','5000','Adelaide','Australia');

-- HOTSPOTS
-- INSERT INTO `Hotspots` VALUES (1,'admin@wdcproject.com','196 Grenfell St','5000','Adelaide','Australia',-34.923698,138.608475, CURRENT_TIMESTAMP());
INSERT INTO `Hotspots` VALUES (2,'admin@wdcproject.com','Jeffrey Smart Building, 217/243 Hindley St','5000','Adelaide','Australia',-34.923813,138.590698,CURRENT_TIMESTAMP());
INSERT INTO `Hotspots` VALUES (3,'admin@wdcproject.com','299 Montacute Rd, Newton','5074','Adelaide','Australia',-34.888531,138.674530,CURRENT_TIMESTAMP - INTERVAL 3 WEEK);

-- CheckIn
-- INSERT INTO `CheckIn` VALUES (1,'chris.hemsworth@gmail.com','adelaide.airport@gmail.com',CURRENT_TIMESTAMP());
-- INSERT INTO `CheckIn` VALUES (2,'chris.hemsworth@gmail.com','rundle.mall@gmail.com',CURRENT_TIMESTAMP());
-- INSERT INTO `CheckIn` VALUES (3,'hugh.jackman@gmail.com','adelaide.airport@gmail.com',CURRENT_TIMESTAMP());
