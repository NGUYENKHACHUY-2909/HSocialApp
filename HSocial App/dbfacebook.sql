-- create database 
DROP DATABASE IF EXISTS HSocial;
CREATE DATABASE IF NOT EXISTS HSocial;
USE HSocial;

-- create table attachment_avt
DROP TABLE IF EXISTS `Attachment_Avatar`;
CREATE TABLE IF NOT EXISTS `Attachment_Avatar` (
    id                  VARCHAR(255) PRIMARY KEY,
    fileName            VARCHAR(255) NOT NULL,
    fileType            VARCHAR(255)
);

-- create table attachment_background
DROP TABLE IF EXISTS `Attachment_Background`;
CREATE TABLE IF NOT EXISTS `Attachment_Background` (
    id                  VARCHAR(255) PRIMARY KEY,
    fileName            VARCHAR(255) NOT NULL,
    fileType            VARCHAR(255)
);

-- create table user
DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user`(
    user_id             TINYINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    user_name           VARCHAR(50) NOT NULL CHECK(length(user_name) > 6 AND length(user_name) < 50),
    `password` 		    VARCHAR(800) NOT NULL,
    email               VARCHAR(255) NOT NULL UNIQUE,
    address             LONGTEXT NOT NULL,
    date_of_birth       DATETIME NOT NULL, 
    avatar_id           VARCHAR(255),
    background_id       VARCHAR(255),
    `description`       LONGTEXT,
    `education`         LONGTEXT,
    gender              ENUM('MALE', 'FEMALE'),
    `role`              ENUM('ADMIN', 'USER'),
    phone_number        VARCHAR(20) UNIQUE CHECK (phone_number LIKE '0%' AND LENGTH(phone_number) = 10),
    created_date        DATETIME NOT NULL DEFAULT NOW(),
    FOREIGN KEY(avatar_id) REFERENCES Attachment_Avatar(id),
    FOREIGN KEY(background_id) REFERENCES Attachment_Background(id)
);

-- create table Post
DROP TABLE IF EXISTS `post`;
CREATE TABLE IF NOT EXISTS `post` (
    post_id             INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    user_id             TINYINT UNSIGNED NOT NULL,
    page_id             TINYINT UNSIGNED DEFAULT NULL,
    attachment_file     VARCHAR(255),
    content             TEXT,
    created_date        DATETIME NOT NULL DEFAULT NOW(),
    FOREIGN KEY(user_id) REFERENCES `user`(user_id)
);

-- create table comment
DROP TABLE IF EXISTS `comment`;
CREATE TABLE IF NOT EXISTS `comment`(
    comment_id          TINYINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    user_id             TINYINT UNSIGNED NOT NULL,
    post_id             INT UNSIGNED,
    content             TEXT NOT NULL,
    created_date        DATETIME NOT NULL DEFAULT NOW(),
    FOREIGN KEY(user_id) REFERENCES `user`(user_id),
    FOREIGN KEY(post_id) REFERENCES `post`(post_id) ON DELETE CASCADE
);


-- create table like
DROP TABLE IF EXISTS `like`;
CREATE TABLE IF NOT EXISTS `like`(
    like_id             TINYINT UNSIGNED  PRIMARY KEY AUTO_INCREMENT,
    user_id             TINYINT UNSIGNED,
    post_id             INT UNSIGNED NOT NULL,
    created_date        DATETIME NOT NULL DEFAULT NOW(),
    FOREIGN KEY(user_id) REFERENCES `user`(user_id) ON DELETE CASCADE,
    FOREIGN KEY(post_id) REFERENCES `post`(post_id)  ON DELETE CASCADE,
    UNIQUE(user_id, post_id)
);

-- create table friendships
DROP TABLE IF EXISTS `friendships`;
CREATE TABLE IF NOT EXISTS `friendships`(
    friendships_id          INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    user_id                 TINYINT UNSIGNED NOT NULL,
    friend_id               TINYINT UNSIGNED NOT NULL,
    `status`                ENUM('pending','accepted','rejected') NOT NULL DEFAULT 'pending',
    FOREIGN KEY(user_id) REFERENCES `user`(user_id) ON DELETE CASCADE,
    FOREIGN KEY(friend_id) REFERENCES `user`(user_id) ON DELETE CASCADE,
    UNIQUE KEY(user_id, friend_id)
);

-- create table notifications
DROP TABLE IF EXISTS notifications;
CREATE TABLE IF NOT EXISTS notifications (
    notifications_id        INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    user_id                 TINYINT UNSIGNED NOT NULL,
    notification_text       TEXT NOT NULL,
    is_read                 BOOLEAN NOT NULL DEFAULT FALSE,
    created_at              DATETIME DEFAULT NOW(),
    friend_id               TINYINT UNSIGNED NOT NULL, -- id của người like/bình luận hoặc gửi lời mời kết bạn.
    create_user_attachment  VARCHAR(255),
    FOREIGN KEY(user_id) REFERENCES `user`(user_id),
    FOREIGN KEY(friend_id) REFERENCES `user`(user_id)
);
