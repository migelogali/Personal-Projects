SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

DROP TABLE IF EXISTS `Contacts` ; 
DROP TABLE IF EXISTS `Jobs_Skills` ;
DROP TABLE IF EXISTS `Skills` ;
DROP TABLE IF EXISTS `Jobs` ;
DROP TABLE IF EXISTS `Users` ;

CREATE TABLE IF NOT EXISTS `Users` (
    `user_id` INT NOT NULL AUTO_INCREMENT,
    `user_name` VARCHAR(100) NOT NULL,
    `user_email` VARCHAR(255) NOT NULL UNIQUE,
    `user_password` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`user_id`));

CREATE TABLE IF NOT EXISTS `Jobs` (
    `job_id` INT NOT NULL AUTO_INCREMENT,
    `user_id` INT NOT NULL,
    `job_company` VARCHAR(100) NOT NULL,
    `job_title` VARCHAR(100) NOT NULL,
    /* may not know job location and website may not be where person applied on */
    `job_location` VARCHAR(100) NULL,
    `job_website` VARCHAR(255) NULL,
    `job_date_applied` DATE NOT NULL,
    /* start with most beginning option, can change later */
    `job_status` ENUM('Applied', 'Interviewing', 'Waiting', 'Offer', 'Rejected') NOT NULL DEFAULT 'Applied',
    /* put TEXT to have unlimited characters instead of VARCHAR(255) as per Gurveer's suggestion */
    `job_notes` TEXT NULL,
    PRIMARY KEY (`job_id`),
    CONSTRAINT `fk_jobs_user_id`
        FOREIGN KEY (`user_id`)
        REFERENCES `Users` (`user_id`)
        ON DELETE CASCADE
        ON UPDATE CASCADE);

CREATE TABLE IF NOT EXISTS `Skills` (
    `skill_id` INT NOT NULL AUTO_INCREMENT,
    `user_id` INT NOT NULL,
    `skill_name` VARCHAR(100) NOT NULL,
    `skill_category` ENUM('Language', 'Framework', 'Tool', 'Database', 'Version Control', 'Cloud Platforms', 'Operating Systems') NOT NULL DEFAULT 'Language',
    `skill_level` ENUM('Beginner', 'Intermediate', 'Advanced') NOT NULL DEFAULT 'Beginner',
    PRIMARY KEY (`skill_id`),
    /* unique added per Gurveer's comment about user_id and skill_name 
    so dups can't be made for skill_name */
    UNIQUE (`user_id`, `skill_name`),
    CONSTRAINT `fk_skills_user_id`
        FOREIGN KEY (`user_id`)
        REFERENCES `Users` (`user_id`)
        ON DELETE CASCADE
        ON UPDATE CASCADE);

/* Main many-to-many table */
CREATE TABLE IF NOT EXISTS `Jobs_Skills` (
    `job_skill_id` INT NOT NULL AUTO_INCREMENT,
    `job_id` INT NOT NULL,
    `skill_id` INT NOT NULL,
    PRIMARY KEY (`job_skill_id`),
    CONSTRAINT `fk_job_id`
        FOREIGN KEY (`job_id`)
        REFERENCES `Jobs` (`job_id`)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT `fk_skill_id`
        FOREIGN KEY (`skill_id`)
        REFERENCES `Skills` (`skill_id`)
        ON DELETE CASCADE
        ON UPDATE CASCADE);

CREATE TABLE IF NOT EXISTS `Contacts` (
    `contact_id` INT NOT NULL AUTO_INCREMENT,
    `user_id` INT NOT NULL,
    /* as per, "link them to specific applications if needed" from project plan */
    `job_id` INT NULL,
    `contact_name` VARCHAR(100) NOT NULL,
    `contact_email` VARCHAR(255) NULL,
    `contact_linkedin` VARCHAR(100) NULL,
    /* can make change to TEXT like job_notes */
    `contact_notes` VARCHAR(255) NULL,
    PRIMARY KEY (`contact_id`),
    CONSTRAINT `fk_contacts_user_id`
        FOREIGN KEY (`user_id`)
        REFERENCES `Users` (`user_id`)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT `fk_contacts_job_id`
        FOREIGN KEY (`job_id`)
        REFERENCES `Jobs` (`job_id`)
        ON DELETE CASCADE
        ON UPDATE CASCADE);
