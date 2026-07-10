const { query } = require("../db");

function toDomainUser(row) {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    username: row.username,
    email: row.email,
    role: row.role,
    passwordHash: row.password_hash,
    createdAt: row.created_at
  };
}

async function findByEmail(email) {
  const normalizedEmail = email.toLowerCase();
  const result = await query(
    `SELECT id, username, email, role, password_hash, created_at
     FROM players
     WHERE email = $1
     LIMIT 1`,
    [normalizedEmail]
  );

  return toDomainUser(result.rows[0]);
}

async function findById(id) {
  const result = await query(
    `SELECT id, username, email, role, password_hash, created_at
     FROM players
     WHERE id = $1
     LIMIT 1`,
    [id]
  );

  return toDomainUser(result.rows[0]);
}

async function createUser({ username, email, passwordHash, role = "player" }) {
  const normalizedEmail = email.toLowerCase();

  try {
    const result = await query(
      `INSERT INTO players (username, email, role, password_hash)
       VALUES ($1, $2, $3, $4)
       RETURNING id, username, email, role, password_hash, created_at`,
      [username, normalizedEmail, role, passwordHash]
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
