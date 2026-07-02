-- Create database
CREATE DATABASE IF NOT EXISTS student_management CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE student_management;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Students table
CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    age INT NOT NULL,
    gender VARCHAR(10) NOT NULL,
    department VARCHAR(100) NOT NULL,
    semester INT NOT NULL,
    cgpa FLOAT NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_name (name),
    INDEX idx_department (department),
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample data
INSERT INTO users (username, email, password) VALUES 
('admin', 'admin@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY4GyDqO0r7Xl0O'); -- password: admin123

INSERT INTO students (name, age, gender, department, semester, cgpa, email, phone) VALUES 
('John Doe', 22, 'Male', 'Computer Science', 6, 8.5, 'john@example.com', '+1234567890'),
('Jane Smith', 21, 'Female', 'Electronics', 5, 9.2, 'jane@example.com', '+1987654321'),
('Bob Johnson', 23, 'Male', 'Mechanical', 7, 7.8, 'bob@example.com', '+1122334455'),
('Alice Williams', 20, 'Female', 'Computer Science', 4, 9.5, 'alice@example.com', '+1555666777'),
('Charlie Brown', 22, 'Male', 'Electronics', 6, 8.0, 'charlie@example.com', '+1999888777');
