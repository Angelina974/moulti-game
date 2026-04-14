-- Optional seed (for development only)
-- Password hash below is only a placeholder string; replace with a real scrypt hash produced by your API flow.

INSERT INTO players (username, email, password_hash)
VALUES ('demo-player', 'demo@example.com', 'REPLACE_WITH_REAL_HASH')
ON CONFLICT (email) DO NOTHING;
