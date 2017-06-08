  CREATE TABLE `dashboard` (
  `Id` int(20) NOT NULL AUTO_INCREMENT,
  `AppId` varchar(45) NOT NULL,
  `Title` nvarchar(200) DEFAULT NULL,
  `ShareWith` nvarchar(200) DEFAULT NULL,
  `Description` nvarchar(500) DEFAULT NULL,
  `User` nvarchar(200) NOT NULL,
  `CreatedAt` datetime NOT NULL,
  `Config` nvarchar(2000) DEFAULT NULL,
  `Layout` mediumtext CHARACTER SET big5,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Id_UNIQUE` (`Id`)
)