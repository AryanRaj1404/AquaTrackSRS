-- ==========================================
-- AquaTrack Initial Database Schema
-- Database : PostgreSQL
-- Migration: V1
-- ==========================================

CREATE TABLE apartment (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL
);

CREATE TABLE household (
    id BIGSERIAL PRIMARY KEY,

    flat_number VARCHAR(255) NOT NULL,

    flat_size DOUBLE PRECISION NOT NULL,

    occupancy INTEGER NOT NULL,

    apartment_id BIGINT NOT NULL,

    CONSTRAINT fk_household_apartment
        FOREIGN KEY (apartment_id)
        REFERENCES apartment(id)
        ON DELETE CASCADE,

    CONSTRAINT uq_household_flat
        UNIQUE(apartment_id, flat_number)
);

CREATE TABLE users (

    id BIGSERIAL PRIMARY KEY,

    username VARCHAR(255) NOT NULL UNIQUE,

    password VARCHAR(255),

    first_name VARCHAR(255) NOT NULL,

    last_name VARCHAR(255) NOT NULL,

    email VARCHAR(255) NOT NULL UNIQUE,

    mobile_number VARCHAR(255) UNIQUE,

    role VARCHAR(50) NOT NULL,

    provider VARCHAR(50) NOT NULL,

    household_id BIGINT,

    CONSTRAINT fk_users_household
        FOREIGN KEY (household_id)
        REFERENCES household(id)
        ON DELETE SET NULL
);

CREATE TABLE meter (

    id BIGSERIAL PRIMARY KEY,

    meter_number VARCHAR(255) NOT NULL UNIQUE,

    meter_type VARCHAR(50) NOT NULL,

    installed_date DATE,

    active BOOLEAN NOT NULL,

    household_id BIGINT NOT NULL,

    CONSTRAINT fk_meter_household
        FOREIGN KEY (household_id)
        REFERENCES household(id)
        ON DELETE CASCADE
);

CREATE TABLE tariff_plan (

    id BIGSERIAL PRIMARY KEY,

    plan_name VARCHAR(255) NOT NULL,

    rate_per_unit DOUBLE PRECISION NOT NULL,

    fixed_charge DOUBLE PRECISION NOT NULL,

    effective_from DATE,

    effective_to DATE,

    description VARCHAR(255)
);

CREATE TABLE billing_cycle (

    id BIGSERIAL PRIMARY KEY,

    start_date DATE,

    end_date DATE,

    total_amount DOUBLE PRECISION,

    status VARCHAR(50) NOT NULL,

    household_id BIGINT NOT NULL,

    tariff_plan_id BIGINT,

    CONSTRAINT fk_billing_household
        FOREIGN KEY (household_id)
        REFERENCES household(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_billing_tariff
        FOREIGN KEY (tariff_plan_id)
        REFERENCES tariff_plan(id)
        ON DELETE SET NULL
);

CREATE TABLE water_usage_log (

    id BIGSERIAL PRIMARY KEY,

    usage_date DATE,

    liters_consumed DOUBLE PRECISION,

    source VARCHAR(50) NOT NULL,

    household_id BIGINT NOT NULL,

    billing_cycle_id BIGINT,

    CONSTRAINT fk_usage_household
        FOREIGN KEY (household_id)
        REFERENCES household(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_usage_billing
        FOREIGN KEY (billing_cycle_id)
        REFERENCES billing_cycle(id)
        ON DELETE SET NULL
);

CREATE INDEX idx_household_apartment
ON household(apartment_id);

CREATE INDEX idx_users_household
ON users(household_id);

CREATE INDEX idx_meter_household
ON meter(household_id);

CREATE INDEX idx_billing_household
ON billing_cycle(household_id);

CREATE INDEX idx_billing_tariff
ON billing_cycle(tariff_plan_id);

CREATE INDEX idx_usage_household
ON water_usage_log(household_id);

CREATE INDEX idx_usage_billing
ON water_usage_log(billing_cycle_id);