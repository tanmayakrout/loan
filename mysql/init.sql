CREATE DATABASE IF NOT EXISTS home_loan_db;
USE home_loan_db;

CREATE TABLE IF NOT EXISTS loan_applications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255),
  phone VARCHAR(20),
  principal DECIMAL(12,2),
  annual_interest_rate DECIMAL(5,2),
  tenure_years INT,
  emi_amount DECIMAL(12,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

