CREATE DATABASE IF NOT EXISTS civic_db;
USE civic_db;

-- The tables will be automatically created by Spring Boot (hibernate.ddl-auto=update)
-- However, here is the manual schema for reference or initialization

-- CREATE TABLE users (
--     user_id BIGINT AUTO_INCREMENT PRIMARY KEY,
--     name VARCHAR(255) NOT NULL,
--     email VARCHAR(255) NOT NULL UNIQUE,
--     password VARCHAR(255) NOT NULL,
--     role VARCHAR(50) NOT NULL,
--     phone VARCHAR(20)
-- );

-- CREATE TABLE complaints (
--     complaint_id BIGINT AUTO_INCREMENT PRIMARY KEY,
--     title VARCHAR(255) NOT NULL,
--     description TEXT,
--     category VARCHAR(100),
--     location VARCHAR(255),
--     image_url VARCHAR(255),
--     status VARCHAR(50) DEFAULT 'Pending',
--     user_id BIGINT,
--     created_date DATETIME,
--     FOREIGN KEY (user_id) REFERENCES users(user_id)
-- );
