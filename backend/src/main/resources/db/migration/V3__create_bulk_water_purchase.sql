CREATE TABLE bulk_water_purchase(

    id BIGSERIAL PRIMARY KEY,

    apartment_id BIGINT NOT NULL,

    billing_cycle_id BIGINT NOT NULL,

    purchase_date DATE NOT NULL,

    source VARCHAR(30) NOT NULL,

    volume_kl DOUBLE PRECISION NOT NULL,

    unit_cost DOUBLE PRECISION NOT NULL,

    total_cost DOUBLE PRECISION NOT NULL,

    supplier VARCHAR(255) NOT NULL,

    CONSTRAINT fk_bulk_apartment
        FOREIGN KEY(apartment_id)
        REFERENCES apartment(id),

    CONSTRAINT fk_bulk_cycle
        FOREIGN KEY(billing_cycle_id)
        REFERENCES billing_cycle(id)
);