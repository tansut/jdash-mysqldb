CREATE TABLE `dashlet` (
  `Id` int(20) NOT NULL AUTO_INCREMENT,
  `ModuleId` varchar(100) NOT NULL,
  `DashboardId` bigint(20) NOT NULL,
  `Configuration` nvarchar(2000) DEFAULT NULL,
  `Title` nvarchar(200) DEFAULT NULL,
  `Description` nvarchar(2000) DEFAULT NULL,
  `CreatedAt` datetime NOT NULL,
  PRIMARY KEY (`Id`)
)