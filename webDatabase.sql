
DROP DATABASE `covidTraceDB`;

CREATE DATABASE `covidTraceDB`;

USE `covidTraceDB`;

CREATE TABLE `BasicUser`(
email VARCHAR(255),
firstName VARCHAR(255),
lastName VARCHAR(255),
phoneNum VARCHAR(50),
icPsprt VARCHAR(15),
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
PRIMARY KEY(email)
);

CREATE TABLE `Address`(
id INT AUTO_INCREMENT,
venue VARCHAR(255),
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

CREATE TABLE `Hotspot`(
id INT AUTO_INCREMENT,
creator VARCHAR(255),
address VARCHAR(255),
zipCode VARCHAR(10),
city VARCHAR(20),
country VARCHAR(20),
lat FLOAT( 10, 6 ) NOT NULL,
lng FLOAT( 10, 6 ) NOT NULL,
PRIMARY KEY(id),
FOREIGN KEY (creator) REFERENCES Admin(email)
);

CREATE TABLE Security(
id INT AUTO_INCREMENT,
user VARCHAR(255),
password VARCHAR(255),
accountType VARCHAR(10),
PRIMARY KEY (id)
);


-- Sample data to test

INSERT INTO BasicUser VALUES ("m2.noorbahr@gmail.com","Mahan","Noorbahr","+601164398065","H96810461");
INSERT INTO BasicUser VALUES ("ghanem.ganadi@gmail.com","Ghanem","Ganadi","+601164398065","ABCEFG1");
INSERT INTO BasicUser VALUES ("talha1h.zubayer@gmail.com","Talhah","Zubayer","+601164398065","ZubZub1234");
INSERT INTO BasicUser VALUES ("niaj.sharif@gmail.com","Niaj","Sharif","+601164398065","SHarif123");

INSERT INTO Security (user,password,accountType) VALUES ("m2.noorbahr@gmail.com","password1234","user");
INSERT INTO Security (user,password,accountType) VALUES ("ghanem.ganadi@gmail.com","password1234","user");
INSERT INTO Security (user,password,accountType) VALUES ("talha1h.zubayer@gmail.com","password1234","user");

