-- V2: Add meter table
-- meter -> household : ON DELETE CASCADE (Meter belongs to Household, deleted when household is deleted)

CREATE TABLE meter (
    id              BIGSERIAL PRIMARY KEY,
    meter_number    VARCHAR(255) UNIQUE,
    meter_type      VARCHAR(50),
    installed_date  DATE,
    active          BOOLEAN,
    household_id    BIGINT REFERENCES household(id) ON DELETE CASCADE
);

CREATE INDEX idx_meter_household_id ON meter(household_id);