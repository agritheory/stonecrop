-- Stonecrop graphql-middleware playground schema
--
-- Run against a PostgreSQL database before starting the dev server:
--   psql $DATABASE_URL -f migrations/001_initial.sql
--
-- Column names use the same casing as the doctype field names in
-- server/doctypes/*.json. The middleware quotes all column names when
-- generating SQL, so camelCase identifiers are safe but must be
-- quoted consistently.

CREATE TABLE IF NOT EXISTS users (
  id           TEXT        PRIMARY KEY,
  name         TEXT        NOT NULL,
  email        TEXT        NOT NULL UNIQUE,
  role         TEXT        NOT NULL DEFAULT 'user',
  "createdAt"  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt"  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
  id           TEXT           PRIMARY KEY,
  "userId"     TEXT           NOT NULL REFERENCES users(id),
  status       TEXT           NOT NULL DEFAULT 'pending',
  total        NUMERIC(12, 2) NOT NULL DEFAULT 0,
  items        JSONB,
  "createdAt"  TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

-- Seed data
INSERT INTO users (id, name, email, role) VALUES
  ('1', 'Alice Admin',   'alice@example.com',   'admin'),
  ('2', 'Bob User',      'bob@example.com',     'user'),
  ('3', 'Charlie Guest', 'charlie@example.com', 'guest')
ON CONFLICT (id) DO NOTHING;

INSERT INTO orders (id, "userId", status, total, items) VALUES
  ('1', '2', 'pending',   99.99,
   '[{"id":"1","productName":"Widget A","quantity":2,"price":29.99},{"id":"2","productName":"Widget B","quantity":1,"price":40.01}]'::jsonb),
  ('2', '2', 'completed', 150.00,
   '[{"id":"3","productName":"Premium Widget","quantity":1,"price":150.00}]'::jsonb)
ON CONFLICT (id) DO NOTHING;
