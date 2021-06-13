-- MySQL dump 10.13  Distrib 8.0.25, for Linux (x86_64)
--
-- Host: 127.0.0.1    Database: covidTraceDB
-- ------------------------------------------------------
-- Server version	8.0.19-0ubuntu5

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `covidTraceDB`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `covidTraceDB` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `covidTraceDB`;

--
-- Table structure for table `Address`
--

DROP TABLE IF EXISTS `Address`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Address` (
  `id` int NOT NULL AUTO_INCREMENT,
  `venue` varchar(255) DEFAULT NULL,
  `buildingName` varchar(50) DEFAULT NULL,
  `streetName` varchar(100) DEFAULT NULL,
  `zipCode` varchar(10) DEFAULT NULL,
  `city` varchar(20) DEFAULT NULL,
  `country` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `venue` (`venue`),
  CONSTRAINT `Address_ibfk_1` FOREIGN KEY (`venue`) REFERENCES `VenueOwner` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Address`
--

LOCK TABLES `Address` WRITE;
/*!40000 ALTER TABLE `Address` DISABLE KEYS */;
INSERT INTO `Address` VALUES (1,'adelaideuni@gmail.com','The University of Adelaide','North Terrace','5005','Adelaide','Australia'),(2,'adelaide.airport@gmail.com','Adelaide Airport','1 James Schofield Dr','5950','Adelaide','Australia'),(3,'rundle.mall@gmail.com','Rundle Mall Plaza','50 Rundle Mall','5000','Adelaide','Australia');
/*!40000 ALTER TABLE `Address` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Admin`
--

DROP TABLE IF EXISTS `Admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Admin` (
  `email` varchar(255) NOT NULL,
  `firstName` varchar(255) DEFAULT NULL,
  `lastName` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Admin`
--

LOCK TABLES `Admin` WRITE;
/*!40000 ALTER TABLE `Admin` DISABLE KEYS */;
INSERT INTO `Admin` VALUES ('admin@wdcproject.com','Admin','Admin'),('admin2@wdcproject.com','Admin2','Admin2');
/*!40000 ALTER TABLE `Admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `BasicUser`
--

DROP TABLE IF EXISTS `BasicUser`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `BasicUser` (
  `email` varchar(255) NOT NULL,
  `firstName` varchar(255) DEFAULT NULL,
  `lastName` varchar(255) DEFAULT NULL,
  `phoneNum` varchar(50) DEFAULT NULL,
  `icPsprt` varchar(15) DEFAULT NULL,
  `weeklyHotspotNoti` int DEFAULT NULL,
  `venueHotspotNoti` int DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `BasicUser`
--

LOCK TABLES `BasicUser` WRITE;
/*!40000 ALTER TABLE `BasicUser` DISABLE KEYS */;
INSERT INTO `BasicUser` VALUES ('chris.hemsworth@gmail.com','Chris','Hemsworth','12345678','ABC1234',1,1),('hugh.jackman@gmail.com','Hugh','Jackman','12345678','ABC1234',1,1);
/*!40000 ALTER TABLE `BasicUser` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `CheckIn`
--

DROP TABLE IF EXISTS `CheckIn`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CheckIn` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user` varchar(255) DEFAULT NULL,
  `venue` varchar(255) DEFAULT NULL,
  `time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user` (`user`),
  KEY `venue` (`venue`),
  CONSTRAINT `CheckIn_ibfk_1` FOREIGN KEY (`user`) REFERENCES `BasicUser` (`email`),
  CONSTRAINT `CheckIn_ibfk_2` FOREIGN KEY (`venue`) REFERENCES `VenueOwner` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CheckIn`
--

LOCK TABLES `CheckIn` WRITE;
/*!40000 ALTER TABLE `CheckIn` DISABLE KEYS */;
INSERT INTO `CheckIn` VALUES (1,'chris.hemsworth@gmail.com','adelaide.airport@gmail.com','2021-06-12 10:44:05'),(2,'chris.hemsworth@gmail.com','rundle.mall@gmail.com','2021-06-12 10:44:28'),(3,'hugh.jackman@gmail.com','adelaide.airport@gmail.com','2021-06-12 10:45:24');
/*!40000 ALTER TABLE `CheckIn` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Hotspots`
--

DROP TABLE IF EXISTS `Hotspots`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Hotspots` (
  `id` int NOT NULL AUTO_INCREMENT,
  `creator` varchar(255) DEFAULT NULL,
  `street` varchar(255) DEFAULT NULL,
  `zipCode` varchar(10) DEFAULT NULL,
  `city` varchar(20) DEFAULT NULL,
  `country` varchar(20) DEFAULT NULL,
  `lat` float(10,6) NOT NULL,
  `lng` float(10,6) NOT NULL,
  `dateAdded` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `creator` (`creator`),
  CONSTRAINT `Hotspots_ibfk_1` FOREIGN KEY (`creator`) REFERENCES `Admin` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Hotspots`
--

LOCK TABLES `Hotspots` WRITE;
/*!40000 ALTER TABLE `Hotspots` DISABLE KEYS */;
INSERT INTO `Hotspots` VALUES (1,'admin@wdcproject.com','196 Grenfell St','5000','Adelaide','Australia',-34.923698,138.608475,'2021-06-12 10:35:18'),(2,'admin@wdcproject.com','Jeffrey Smart Building, 217/243 Hindley St','5000','Adelaide','Australia',-34.923813,138.590698,'2021-06-12 10:36:32'),(5,'admin@wdcproject.com','299 Montacute Rd, Newton','5074','Adelaide','Australia',-34.888531,138.674530,'2021-06-12 10:40:51');
/*!40000 ALTER TABLE `Hotspots` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Security`
--

DROP TABLE IF EXISTS `Security`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Security` (
  `user` varchar(255) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `accountType` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`user`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Security`
--

LOCK TABLES `Security` WRITE;
/*!40000 ALTER TABLE `Security` DISABLE KEYS */;
INSERT INTO `Security` VALUES ('adelaide.airport@gmail.com','$argon2i$v=19$m=4096,t=3,p=1$2CgVov3AX9Lp/bPcvFvmaQ$FrG2G0zhJMvIC4Nc1i5TucOUCsJVsCt6LKCapFzWk1M','venue'),('adelaideuni@gmail.com','$argon2i$v=19$m=4096,t=3,p=1$o9XoUFdXJRQVpG/+g0VC8g$NLhumRKPRT8H2BY+yfgNnMgn02s69aYvfTIGtdm0MVk','venue'),('admin@wdcproject.com','$argon2i$v=19$m=4096,t=3,p=1$LJG5Ew4PYpth0tVx9WHIwg$v5eEq1gk7RTXnLCMSAm4SPGmTc3jhO3Iy7JPvSFtl3k','admin'),('admin2@wdcproject.com','$argon2i$v=19$m=4096,t=3,p=1$OCfOcMQx7VFlAamuhubfCw$JjAQKPqBpPpmdF+06wjfDcJr/dks8y4Q3IROcuF0mq8','admin'),('chris.hemsworth@gmail.com','$argon2i$v=19$m=4096,t=3,p=1$6Zg/hFxZq8qSh7EqpDZlbw$kPin4faWS8ZEzxX1Qmxd9jNhALdN0TS3s01N3h+H11k','user'),('hugh.jackman@gmail.com','$argon2i$v=19$m=4096,t=3,p=1$p/e0FiPtYv6mSARfQRmmaw$muD8OwMIq6LLVKStflWFD3Se6rvoDUEUhLvzH4S4mI4','user'),('rundle.mall@gmail.com','$argon2i$v=19$m=4096,t=3,p=1$0Pb0F+t7zfZKNKPfG530uQ$taUJ6ojGQT0zQicHOlSg0TOE77zV7mOa5ZkH6Dml6Is','venue');
/*!40000 ALTER TABLE `Security` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `VenueOwner`
--

DROP TABLE IF EXISTS `VenueOwner`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `VenueOwner` (
  `email` varchar(255) NOT NULL,
  `firstName` varchar(255) DEFAULT NULL,
  `lastName` varchar(255) DEFAULT NULL,
  `phoneNum` varchar(50) DEFAULT NULL,
  `businessName` varchar(50) DEFAULT NULL,
  `checkInCode` varchar(10) DEFAULT NULL,
  `lat` float(10,6) NOT NULL,
  `lng` float(10,6) NOT NULL,
  `isHotspot` int DEFAULT NULL,
  PRIMARY KEY (`email`),
  UNIQUE KEY `checkInCode` (`checkInCode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `VenueOwner`
--

LOCK TABLES `VenueOwner` WRITE;
/*!40000 ALTER TABLE `VenueOwner` DISABLE KEYS */;
INSERT INTO `VenueOwner` VALUES ('adelaide.airport@gmail.com','Airport','Adelaide','1234567','Adelaide Airport','DLDRPR8064',-34.935284,138.534912,0),('adelaideuni@gmail.com','AdelaideUni','Adelaide','+61883135208','University of Adelaide','NVR318336',-34.918922,138.604233,1),('rundle.mall@gmail.com','Rundle','Mall','1234567','Rundle Mall','RNDL671296',-34.922489,138.601501,1);
/*!40000 ALTER TABLE `VenueOwner` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-06-12 10:48:09
