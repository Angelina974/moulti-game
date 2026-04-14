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

async function initDatabase() {
  await query("SELECT 1");
}

module.exports = {
  query,
  pool,
  initDatabase
};
