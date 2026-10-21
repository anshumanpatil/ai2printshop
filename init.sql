-- init.sql
CREATE DATABASE printstore;
GRANT ALL PRIVILEGES ON DATABASE printstore TO postgres;

-- CREATE TABLE IF NOT EXISTS users (
--     id SERIAL PRIMARY KEY,
--     name VARCHAR(100),
--     email VARCHAR(100) UNIQUE
-- );

-- INSERT INTO users (name, email) VALUES 
-- ('Alice Smith', 'alice@example.com'),
-- ('Bob Jones', 'bob@example.com')
-- ON CONFLICT (email) DO NOTHING;
