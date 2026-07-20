ALTER TABLE billing_cycle
    ADD COLUMN IF NOT EXISTS apartment_id BIGINT REFERENCES apartment(id);