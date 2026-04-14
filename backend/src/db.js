const { Pool } = require("pg");

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required to start the backend.");
}

const shouldUseSsl = process.env.PGSSL === "true";

const pool = new Pool({
  connectionString,
  ssl: shouldUseSsl ? { rejectUnauthorized: false } : undefined
});

async function query(text, params = []) {
  return pool.query(text, params);
}

async function ensureSchema() {
  await query('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');

  await query(`
    CREATE TABLE IF NOT EXISTS players (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      username VARCHAR(50) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS player_scores (
      id BIGSERIAL PRIMARY KEY,
      player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
      game_name VARCHAR(100) NOT NULL,
      score_value INTEGER NOT NULL,
      metadata JSONB,
      played_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  await query('CREATE INDEX IF NOT EXISTS idx_players_email ON players (email)');
  await query('CREATE INDEX IF NOT EXISTS idx_scores_player_game ON player_scores (player_id, game_name, played_at DESC)');
}

async function initDatabase() {
  await query("SELECT 1");
  await ensureSchema();
}

module.exports = {
  query,
  pool,
  initDatabase
};
