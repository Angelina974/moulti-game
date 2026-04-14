async function submitGameScore(gameName, scoreValue, metadata = null) {
  try {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      return false;
    }

    const response = await fetch("/api/scores", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ gameName, scoreValue, metadata })
    });

    return response.ok;
  } catch (error) {
    console.error("Failed to submit score:", error);
    return false;
  }
}

window.submitGameScore = submitGameScore;
