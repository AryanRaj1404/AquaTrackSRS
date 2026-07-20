CREATE TABLE tariff_tier (

    id BIGSERIAL PRIMARY KEY,

    tariff_plan_id BIGINT NOT NULL,

    tier_order INTEGER NOT NULL,

    upto_kl DOUBLE PRECISION,

    rate_per_kl DOUBLE PRECISION NOT NULL,

    CONSTRAINT fk_tariff_tier_plan
        FOREIGN KEY (tariff_plan_id)
        REFERENCES tariff_plan(id)
        ON DELETE CASCADE
);

CREATE INDEX idx_tariff_tier_plan
ON tariff_tier(tariff_plan_id);