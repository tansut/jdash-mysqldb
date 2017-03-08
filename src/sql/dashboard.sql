CREATE TABLE `jdash_local`.`dashboard` (
  `Id` BIGINT(20) NOT NULL AUTO_INCREMENT,
  `AppId` NVARCHAR(45) NOT NULL,
  `Title` NVARCHAR(200) NULL,
  `ShareWith` NVARCHAR(200) NULL,
  `Description` NVARCHAR(500) NULL,
  `User` NVARCHAR(200) NOT NULL,
  `CreatedAt` DATETIME NOT NULL,
  `Config` NVARCHAR(2000) NULL,
  `Layout` NVARCHAR(2000) NULL,
  PRIMARY KEY (`Id`),
  UNIQUE INDEX `Id_UNIQUE` (`Id` ASC));