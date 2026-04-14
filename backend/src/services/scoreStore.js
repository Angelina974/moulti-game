const { query } = require("../db");

async function createScore({ playerId, gameName, scoreValue, metadata = null }) {
  const result = await query(
    `INSERT INTO player_scores (player_id, game_name, score_value, metadata)
     VALUES ($1, $2, $3, $4)
     RETURNING id, player_id, game_name, score_value, metadata, played_at`,
    [playerId, gameName, scoreValue, metadata]
  );

  return result.rows[0];
}

async function listGamesByPlayer(playerId) {
  const result = await query(
    `SELECT DISTINCT game_name
     FROM player_scores
     WHERE player_id = $1
     ORDER BY game_name ASC`,
    [playerId]
  );

  return result.rows.map((row) => row.game_name);
}

async function listScoresByPlayer(playerId, { gameName = null, limit = 50 } = {}) {
  const safeLimit = Math.min(Math.max(Number(limit) || 50, 1), 200);

  if (gameName) {
    const result = await query(
      `SELECT id, player_id, game_name, score_value, metadata, played_at
       FROM player_scores
       WHERE player_id = $1 AND game_name = $2
       ORDER BY played_at DESC
       LIMIT $3`,
      [playerId, gameName, safeLimit]
    );
    return result.rows;
  }

  const result = await query(
    `SELECT id, player_id, game_name, score_value, metadata, played_at
     FROM player_scores
     WHERE player_id = $1
     ORDER BY played_at DESC
     LIMIT $2`,
    [playerId, safeLimit]
  );

  return result.rows;
}

async function deleteScoresByPlayer(playerId, gameName = null) {
  if (gameName) {
    const result = await query(
      `DELETE FROM player_scores
       WHERE player_id = $1 AND game_name = $2`,
      [playerId, gameName]
    );
    return result.rowCount;
  }

  const result = await query(
    `DELETE FROM player_scores
     WHERE player_id = $1`,
    [playerId]
  );
  return result.rowCount;
}

module.exports = {
  createScore,
  listGamesByPlayer,
  listScoresByPlayer,
  deleteScoresByPlayer
};
