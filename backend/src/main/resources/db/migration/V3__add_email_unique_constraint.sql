-- V3: Enforce email uniqueness at the database level.
-- Postgres unique constraints allow multiple NULLs, so this is safe even if
-- some existing rows (e.g. admins) have no email set.

ALTER TABLE users ADD CONSTRAINT uk_users_email UNIQUE (email);
