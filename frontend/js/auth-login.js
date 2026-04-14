const form = document.getElementById("loginForm");
const message = document.getElementById("message");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  message.textContent = "";
  message.className = "message";

  const email = form.email.value.trim();
  const password = form.password.value;

  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const payload = await response.json();

    if (!response.ok) {
      message.textContent = payload.message || "Connexion impossible";
      message.classList.add("error");
      return;
    }

    localStorage.setItem("auth_token", payload.token);
    localStorage.setItem("player", JSON.stringify(payload.player));

    message.textContent = `Bienvenue ${payload.player.username} ! Redirection...`;
    message.classList.add("success");

    setTimeout(() => {
      window.location.href = "/pages/welcome.html";
    }, 700);
  } catch (error) {
    message.textContent = "Erreur reseau, verifie que le serveur tourne";
    message.classList.add("error");
  }
});
