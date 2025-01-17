-- Create Database
CREATE DATABASE InternshipPortal;

-- Use the created database
USE InternshipPortal;

-- Create Users Table
CREATE TABLE Users (
    UserID INT PRIMARY KEY AUTO_INCREMENT,
    Username VARCHAR(100) UNIQUE NOT NULL,
    Password VARCHAR(255) NOT NULL,
    Email VARCHAR(255),
    Phone VARCHAR(20)
);
