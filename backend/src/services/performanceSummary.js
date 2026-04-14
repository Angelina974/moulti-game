function toNumber(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function round2(value) {
  return Math.round(value * 100) / 100;
}

function buildStats(scores) {
  const grouped = new Map();

  for (const score of scores) {
    const gameName = score.game_name;
    const item = grouped.get(gameName) || [];
    item.push(score);
    grouped.set(gameName, item);
  }

  const games = [];

  for (const [gameName, entries] of grouped.entries()) {
    const sortedByDateDesc = [...entries].sort(
      (a, b) => new Date(b.played_at).getTime() - new Date(a.played_at).getTime()
    );

    const values = sortedByDateDesc.map((e) => toNumber(e.score_value));
    const sessions = values.length;
    const bestScore = Math.max(...values);
    const averageScore = round2(values.reduce((sum, v) => sum + v, 0) / sessions);

    const recentValues = values.slice(0, Math.min(5, values.length));
    const olderValues = values.slice(5);

    const recentAverage = round2(
      recentValues.reduce((sum, v) => sum + v, 0) / Math.max(recentValues.length, 1)
    );

    let trend = "stable";
    if (olderValues.length > 0) {
      const olderAverage = olderValues.reduce((sum, v) => sum + v, 0) / olderValues.length;
      const delta = recentAverage - olderAverage;
      if (delta > 5) {
        trend = "improving";
      } else if (delta < -5) {
        trend = "declining";
      }
    }

    games.push({
      gameName,
      sessions,
      averageScore,
      recentAverage,
      bestScore,
      trend,
      lastPlayedAt: sortedByDateDesc[0]?.played_at || null
    });
  }

  games.sort((a, b) => b.sessions - a.sessions);

  return {
    totalSessions: scores.length,
    gameCount: games.length,
    games
  };
}

async function callOpenAIForSummary(stats) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    const error = new Error("OPENAI_API_KEY_MISSING");
    error.code = "OPENAI_API_KEY_MISSING";
    throw error;
  }

  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

  const systemPrompt = [
    "Tu es un coach de performance de jeux video.",
    "Tu analyses uniquement les donnees fournies.",
    "Reponds en JSON valide, sans markdown.",
    "Format exact: {",
    "  \"overview\": string,",
    "  \"strengths\": string[],",
    "  \"focusPoints\": string[],",
    "  \"recommendedGame\": string,",
    "  \"recommendationReason\": string,",
    "  \"nextGoal\": string",
    "}",
    "Contraintes: overview <= 45 mots, chaque tableau max 3 elements, nextGoal concret et mesurable.",
    "N'invente jamais des jeux absents des donnees."
  ].join(" ");

  const userPrompt = `Donnees joueur (JSON): ${JSON.stringify(stats)}`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      temperature: 0.3,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ]
    })
  });

  if (!response.ok) {
    const details = await response.text();
    const error = new Error("OPENAI_API_ERROR");
    error.code = "OPENAI_API_ERROR";
    error.details = details;
    throw error;
  }

  const payload = await response.json();
  const content = payload?.choices?.[0]?.message?.content;

  if (!content) {
    const error = new Error("OPENAI_EMPTY_RESPONSE");
    error.code = "OPENAI_EMPTY_RESPONSE";
    throw error;
  }

  return JSON.parse(content);
}

async function generatePerformanceSummary(scores) {
  const stats = buildStats(scores);

  if (stats.totalSessions === 0) {
    return {
      source: "openai",
      empty: true,
      message: "Aucune partie jouee pour le moment. Joue quelques parties pour obtenir un resume."
    };
  }

  const summary = await callOpenAIForSummary(stats);

  return {
    source: "openai",
    generatedAt: new Date().toISOString(),
    stats,
    summary
  };
}

module.exports = {
  buildStats,
  generatePerformanceSummary
};
