const { query } = require("../db");

function toDomainUser(row) {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    username: row.username,
    email: row.email,
    passwordHash: row.password_hash,
    createdAt: row.created_at
  };
}

async function findByEmail(email) {
  const normalizedEmail = email.toLowerCase();
  const result = await query(
    `SELECT id, username, email, password_hash, created_at
     FROM players
     WHERE email = $1
     LIMIT 1`,
    [normalizedEmail]
  );

  return toDomainUser(result.rows[0]);
}

async function findById(id) {
  const result = await query(
    `SELECT id, username, email, password_hash, created_at
     FROM players
     WHERE id = $1
     LIMIT 1`,
    [id]
  );

  return toDomainUser(result.rows[0]);
}

async function createUser({ username, email, passwordHash }) {
  const normalizedEmail = email.toLowerCase();

  try {
    const result = await query(
      `INSERT INTO players (username, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, username, email, password_hash, created_at`,
      [username, normalizedEmail, passwordHash]
    );

    return { user: toDomainUser(result.rows[0]) };
  } catch (error) {
    if (error.code === "23505") {
      return { error: "EMAIL_ALREADY_EXISTS" };
    }
    throw error;
  }
}

module.exports = {
  findByEmail,
  findById,
  createUser
};
