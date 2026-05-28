-- Create database
CREATE DATABASE IF NOT EXISTS pharmacy_returns;
USE pharmacy_returns;

-- Table 1: USERS
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL, -- 'admin' or 'pharmacy'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table 2: RETURN_REQUESTS
CREATE TABLE IF NOT EXISTS return_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pharmacy_name VARCHAR(100) NOT NULL,
    medicine_name VARCHAR(100) NOT NULL,
    batch_number VARCHAR(50) NOT NULL,
    expiry_date DATE NOT NULL,
    quantity INT NOT NULL,
    reason TEXT NOT NULL,
    image_path VARCHAR(255),
    ai_analysis TEXT,
    status VARCHAR(20) DEFAULT 'Pending', -- 'Pending', 'Approved', 'Rejected'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table 3: ACTIVITY_LOGS
CREATE TABLE IF NOT EXISTS activity_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    action TEXT NOT NULL,
    performed_by VARCHAR(50) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert dummy credentials if not exists
INSERT INTO users (username, password, role)
VALUES 
('admin', 'admin123', 'admin'),
('pharmacy', 'pharmacy123', 'pharmacy')
ON DUPLICATE KEY UPDATE username=username;
