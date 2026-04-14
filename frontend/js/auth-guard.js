async function ensureAuthenticated() {
  const token = localStorage.getItem("auth_token");

  if (!token) {
    window.location.href = "/pages/auth/login.html";
    return;
  }

  try {
    const response = await fetch("/api/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("player");
      window.location.href = "/pages/auth/login.html";
      return;
    }

    const payload = await response.json();
    localStorage.setItem("player", JSON.stringify(payload.player));
  } catch (error) {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("player");
    window.location.href = "/pages/auth/login.html";
  }
}

ensureAuthenticated();
