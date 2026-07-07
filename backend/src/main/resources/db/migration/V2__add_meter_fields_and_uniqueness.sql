-- V2: Add resident details to users, meter configuration to household, and unique usage constraint.

-- Alter users table to add first_name, last_name, email, and phone_number
ALTER TABLE users
ADD COLUMN first_name VARCHAR(255),
ADD COLUMN last_name VARCHAR(255),
ADD COLUMN email VARCHAR(255),
ADD COLUMN phone_number VARCHAR(50);

-- Alter household table to add meter_serial_number and meter_status
ALTER TABLE household
ADD COLUMN meter_serial_number VARCHAR(255),
ADD COLUMN meter_status VARCHAR(50);

-- Alter water_usage_log to add a unique constraint on (household_id, usage_date)
ALTER TABLE water_usage_log
ADD CONSTRAINT uq_household_usage_date UNIQUE (household_id, usage_date);
