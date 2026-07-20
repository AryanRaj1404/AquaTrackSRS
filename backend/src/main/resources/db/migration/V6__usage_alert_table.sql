CREATE TABLE IF NOT EXISTS usage_alert (
    id              BIGSERIAL PRIMARY KEY,
    household_id    BIGINT NOT NULL REFERENCES household(id),
    alert_type      VARCHAR(30) NOT NULL,
    triggered_on    DATE NOT NULL,
    liters_consumed DOUBLE PRECISION,
    threshold_value DOUBLE PRECISION,
    message         VARCHAR(500),
    acknowledged    BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_usage_alert_household ON usage_alert(household_id);