const gameFilter = document.getElementById("gameFilter");
const historyBody = document.getElementById("historyBody");
const statusText = document.getElementById("status");
const refreshButton = document.getElementById("refreshButton");
const deleteButton = document.getElementById("deleteButton");
const summaryButton = document.getElementById("summaryButton");
const summaryCard = document.getElementById("summaryCard");

function getAuthHeader() {
  const token = localStorage.getItem("auth_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }
  return date.toLocaleString("fr-FR");
}

function setStatus(message) {
  statusText.textContent = message;
}

function renderRows(scores) {
  historyBody.innerHTML = "";

  if (!scores.length) {
    const row = document.createElement("tr");
    row.innerHTML = `<td colspan="3">Aucun score enregistre pour ce filtre.</td>`;
    historyBody.appendChild(row);
    return;
  }

  for (const score of scores) {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${score.game_name}</td>
      <td>${score.score_value}</td>
      <td>${formatDate(score.played_at)}</td>
    `;
    historyBody.appendChild(row);
  }
}

function renderSummary(data) {
  if (!data || !summaryCard) {
    return;
  }

  if (data.empty) {
    summaryCard.className = "summary-card empty";
    summaryCard.textContent = data.message || "Pas assez de donnees pour un resume.";
    return;
  }

  const s = data.summary || {};
  const strengths = Array.isArray(s.strengths) ? s.strengths : [];
  const focusPoints = Array.isArray(s.focusPoints) ? s.focusPoints : [];

  summaryCard.className = "summary-card";
  summaryCard.innerHTML = `
    <p><strong>Vue d'ensemble:</strong> ${s.overview || "-"}</p>
    <p><strong>Points forts:</strong> ${strengths.length ? strengths.join(" | ") : "-"}</p>
    <p><strong>A travailler:</strong> ${focusPoints.length ? focusPoints.join(" | ") : "-"}</p>
    <p><strong>Jeu recommande:</strong> ${s.recommendedGame || "-"}</p>
    <p><strong>Pourquoi:</strong> ${s.recommendationReason || "-"}</p>
    <p><strong>Objectif suivant:</strong> ${s.nextGoal || "-"}</p>
  `;
}

async function loadSummary() {
  summaryCard.className = "summary-card empty";
  summaryCard.textContent = "Generation du resume IA...";

  const response = await fetch("/api/insights/performance-summary", {
    headers: getAuthHeader()
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.message || "Impossible de generer le resume IA");
  }

  const payload = await response.json();
  renderSummary(payload);
}

async function loadGames() {
  const response = await fetch("/api/scores/games", {
    headers: getAuthHeader()
  });

  if (!response.ok) {
    throw new Error("Impossible de charger la liste des jeux");
  }

  const payload = await response.json();
  const games = payload.games || [];

  gameFilter.innerHTML = '<option value="">Tous les jeux</option>';
  for (const gameName of games) {
    const option = document.createElement("option");
    option.value = gameName;
    option.textContent = gameName;
    gameFilter.appendChild(option);
  }
}

async function loadHistory() {
  const selectedGame = gameFilter.value;
  const url = selectedGame
    ? `/api/scores/history?game=${encodeURIComponent(selectedGame)}`
    : "/api/scores/history";

  const response = await fetch(url, {
    headers: getAuthHeader()
  });

  if (!response.ok) {
    throw new Error("Impossible de charger l'historique");
  }

  const payload = await response.json();
  renderRows(payload.scores || []);
}

async function deleteHistory() {
  const selectedGame = gameFilter.value;
  const target = selectedGame ? `du jeu ${selectedGame}` : "complet";

  const confirmed = window.confirm(`Supprimer l'historique ${target} ? Cette action est irreversible.`);
  if (!confirmed) {
    return;
  }

  const url = selectedGame
    ? `/api/scores/history?game=${encodeURIComponent(selectedGame)}`
    : "/api/scores/history";

  const response = await fetch(url, {
    method: "DELETE",
    headers: getAuthHeader()
  });

  if (!response.ok) {
    throw new Error("Impossible de supprimer l'historique");
  }

  const payload = await response.json();
  const deletedCount = payload.deletedCount || 0;
  setStatus(`${deletedCount} score(s) supprime(s).`);

  await loadGames();
  await loadHistory();
}

async function init() {
  setStatus("Chargement de l'historique...");

  try {
    await loadGames();
    await loadHistory();
    setStatus("");
  } catch (error) {
    setStatus(error.message);
  }
}

gameFilter.addEventListener("change", () => {
  loadHistory().catch((error) => setStatus(error.message));
});

refreshButton.addEventListener("click", () => {
  init();
});

deleteButton.addEventListener("click", () => {
  deleteHistory().catch((error) => setStatus(error.message));
});

summaryButton.addEventListener("click", () => {
  loadSummary().catch((error) => {
    summaryCard.className = "summary-card empty";
    summaryCard.textContent = error.message;
  });
});

init();
