CREATE TABLE household_join_request
(
    id BIGSERIAL PRIMARY KEY,

    user_id BIGINT NOT NULL,
    apartment_id BIGINT NOT NULL,
    household_id BIGINT NOT NULL,

    status VARCHAR(30) NOT NULL,

    requested_at TIMESTAMP NOT NULL,
    reviewed_at TIMESTAMP,

    reviewed_by BIGINT,

    remarks VARCHAR(500),

    CONSTRAINT fk_join_user
        FOREIGN KEY (user_id)
        REFERENCES users(id),

    CONSTRAINT fk_join_apartment
        FOREIGN KEY (apartment_id)
        REFERENCES apartment(id),

    CONSTRAINT fk_join_household
        FOREIGN KEY (household_id)
        REFERENCES household(id),

    CONSTRAINT fk_join_reviewer
        FOREIGN KEY (reviewed_by)
        REFERENCES users(id)
);