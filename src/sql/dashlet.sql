CREATE TABLE `jdash_local`.`dashlet` (
  `Id` BIGINT(20) NOT NULL AUTO_INCREMENT,
  `ModuleId` NVARCHAR(100) NOT NULL,
  `DashboardId` BIGINT(20) NOT NULL,
  `Configuration` NVARCHAR(2000) NULL,
  `Title` NVARCHAR(200) NULL,
  `Description` NVARCHAR(2000) NULL,
  `CreatedAt` DATETIME NOT NULL,
  PRIMARY KEY (`Id`));
