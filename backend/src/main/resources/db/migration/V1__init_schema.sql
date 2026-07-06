-- V1: Initial schema for AquaTrack
-- Mirrors the JPA entity mappings exactly (table/column names, types, FKs).
-- Cascade rules match the JPA cascade configuration:
--   apartment -> household        : ON DELETE CASCADE   (Apartment owns Household, cascade ALL + orphanRemoval)
--   household -> water_usage_log  : ON DELETE CASCADE   (Household owns WaterUsageLog, cascade ALL + orphanRemoval)
--   household -> billing_cycle    : ON DELETE CASCADE   (Household owns BillingCycle, cascade ALL + orphanRemoval)
--   household -> users            : ON DELETE SET NULL  (deleting a household must not delete resident accounts)
--   billing_cycle -> water_usage_log : ON DELETE SET NULL (optional link)
--   tariff_plan -> billing_cycle     : ON DELETE SET NULL (optional link)

CREATE TABLE apartment (
    id      BIGSERIAL PRIMARY KEY,
    name    VARCHAR(255),
    address VARCHAR(255)
);

CREATE TABLE household (
    id           BIGSERIAL PRIMARY KEY,
    flat_number  VARCHAR(255),
    flat_size    DOUBLE PRECISION,
    occupancy    INTEGER,
    apartment_id BIGINT REFERENCES apartment(id) ON DELETE CASCADE
);

CREATE TABLE users (
    id           BIGSERIAL PRIMARY KEY,
    username     VARCHAR(255) NOT NULL UNIQUE,
    password     VARCHAR(255) NOT NULL,
    role         VARCHAR(50)  NOT NULL,
    household_id BIGINT REFERENCES household(id) ON DELETE SET NULL
);

CREATE TABLE tariff_plan (
    id              BIGSERIAL PRIMARY KEY,
    plan_name       VARCHAR(255),
    rate_per_unit   DOUBLE PRECISION,
    fixed_charge    DOUBLE PRECISION,
    effective_from  DATE,
    effective_to    DATE,
    description     VARCHAR(255)
);

CREATE TABLE billing_cycle (
    id              BIGSERIAL PRIMARY KEY,
    start_date      DATE,
    end_date        DATE,
    total_amount    DOUBLE PRECISION,
    status          VARCHAR(50),
    household_id    BIGINT REFERENCES household(id) ON DELETE CASCADE,
    tariff_plan_id  BIGINT REFERENCES tariff_plan(id) ON DELETE SET NULL
);

CREATE TABLE water_usage_log (
    id                BIGSERIAL PRIMARY KEY,
    usage_date        DATE,
    liters_consumed   DOUBLE PRECISION,
    source            VARCHAR(50),
    household_id      BIGINT REFERENCES household(id) ON DELETE CASCADE,
    billing_cycle_id  BIGINT REFERENCES billing_cycle(id) ON DELETE SET NULL
);

CREATE INDEX idx_household_apartment_id ON household(apartment_id);
CREATE INDEX idx_users_household_id ON users(household_id);
CREATE INDEX idx_billing_cycle_household_id ON billing_cycle(household_id);
CREATE INDEX idx_billing_cycle_tariff_plan_id ON billing_cycle(tariff_plan_id);
CREATE INDEX idx_water_usage_log_household_id ON water_usage_log(household_id);
CREATE INDEX idx_water_usage_log_billing_cycle_id ON water_usage_log(billing_cycle_id);
