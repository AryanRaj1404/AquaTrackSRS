CREATE TABLE invoice (

    id BIGSERIAL PRIMARY KEY,

    invoice_number VARCHAR(100) UNIQUE NOT NULL,

    household_id BIGINT NOT NULL,

    billing_cycle_id BIGINT NOT NULL,

    consumption_kl DOUBLE PRECISION NOT NULL,

    usage_charge DOUBLE PRECISION NOT NULL,

    fixed_charge DOUBLE PRECISION NOT NULL,

    tariff_charge DOUBLE PRECISION,

    distributed_cost DOUBLE PRECISION,

    purchased_rate DOUBLE PRECISION,

    shared_area_charge DOUBLE PRECISION,

    adjustment DOUBLE PRECISION NOT NULL,

    total_amount DOUBLE PRECISION NOT NULL,

    status VARCHAR(30) NOT NULL,

    generated_date DATE NOT NULL,

    CONSTRAINT fk_invoice_household
        FOREIGN KEY (household_id)
        REFERENCES household(id),

    CONSTRAINT fk_invoice_cycle
        FOREIGN KEY (billing_cycle_id)
        REFERENCES billing_cycle(id)
);