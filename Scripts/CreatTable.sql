
CREATE SCHEMA IF NOT EXISTS EzRecipe;
USE EzRecipe;

DROP TABLE IF EXISTS `EzRecipe`.`author` ;
CREATE TABLE `author` (
  `authorID` int(11) NOT NULL,
  `authorName` varchar(100) NOT NULL,
  PRIMARY KEY (`authorID`)
) ;
DROP TABLE IF EXISTS `EzRecipe`.`Duration` ;
CREATE TABLE `duration` (
  `durationID` int(11) NOT NULL AUTO_INCREMENT,
  `recipeID` int(11) DEFAULT NULL,
  `prepTime` varchar(100) DEFAULT NULL,
  `cookTime` varchar(100) DEFAULT NULL,
  `totalTime` varchar(100) NOT NULL,
  PRIMARY KEY (`durationID`),
  CONSTRAINT `fk_Duration` FOREIGN KEY (`recipeID`) REFERENCES `recipe` (`recipeID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ;
DROP TABLE IF EXISTS `EzRecipe`.`ingredient` ;
CREATE TABLE `ingredient` (
  `ingredientID` int(11) NOT NULL,
  `recipeID` int(11) NOT NULL,
  `ingredientName` varchar(1000) CHARACTER SET latin1 COLLATE latin1_bin NOT NULL,
  `ingredientQty` varchar(100) NOT NULL,
  PRIMARY KEY (`ingredientID`),
  CONSTRAINT `fk_Ingredient` FOREIGN KEY (`recipeID`) REFERENCES `recipe` (`recipeID`) ON DELETE NO ACTION ON UPDATE NO ACTION
);
DROP TABLE IF EXISTS `EzRecipe`.`Nutrition` ;
CREATE TABLE `nutrition` (
  `nutritionID` int(11) NOT NULL AUTO_INCREMENT,
  `recipeID` int(11) NOT NULL,
  `calories` float DEFAULT NULL,
  `fatContent` float DEFAULT NULL,
  `satFatContent` float DEFAULT NULL,
  `cholestorolContent` float DEFAULT NULL,
  `sodium` float DEFAULT NULL,
  `carboContent` float DEFAULT NULL,
  `fiberContent` float DEFAULT NULL,
  `sugarContent` float DEFAULT NULL,
  `proteinContent` float DEFAULT NULL,
  PRIMARY KEY (`nutritionID`),
  CONSTRAINT `FKNutrition` FOREIGN KEY (`recipeID`) REFERENCES `recipe` (`recipeID`) ON DELETE NO ACTION ON UPDATE NO ACTION
);
DROP TABLE IF EXISTS `EzRecipe`.`recipe` ;
CREATE TABLE `recipe` (
  `recipeID` int(11) NOT NULL,
  `recipeName` varchar(100) NOT NULL,
  `authorID` int(11) NOT NULL,
  `datePublished` datetime NOT NULL,
  `description` varchar(1000) NOT NULL,
  `image` varchar(2000) DEFAULT NULL,
  `categories` varchar(1000) NOT NULL,
  `keywords` varchar(255) NOT NULL,
  `aggregatedRating` double NOT NULL,
  `reviewCount` double NOT NULL,
  `servings` double DEFAULT NULL,
  `yield` varchar(255) DEFAULT NULL,
  `instructions` varchar(3000) NOT NULL,
  PRIMARY KEY (`recipeID`),
  CONSTRAINT `RecipeFK` FOREIGN KEY (`authorID`) REFERENCES `author` (`authorID`) ON DELETE NO ACTION ON UPDATE NO ACTION
);

DROP TABLE IF EXISTS `EzRecipe`.`Review` ;
CREATE TABLE `review` (
  `reviewID` int(11) NOT NULL,
  `recipeID` int(11) NOT NULL,
  `authorID` int(11) NOT NULL,
  `rating` int(11) NOT NULL,
  `reviewDesc` varchar(2000) DEFAULT NULL,
  `dateSubmitted` datetime NOT NULL,
  `dateModified` datetime NOT NULL,
  PRIMARY KEY (`reviewID`),
  CONSTRAINT `AuthorFK1` FOREIGN KEY (`authorID`) REFERENCES `author` (`authorID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `RecipeFK1` FOREIGN KEY (`recipeID`) REFERENCES `recipe` (`recipeID`) ON DELETE NO ACTION ON UPDATE NO ACTION
);
DROP TABLE IF EXISTS `EzRecipe`.`Users` ;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `fname` varchar(255) NOT NULL,
  `lname` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `username_UNIQUE` (`username`),
  UNIQUE KEY `email_UNIQUE` (`email`)
);
