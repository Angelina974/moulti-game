const form = document.getElementById("registerForm");
const message = document.getElementById("message");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  message.textContent = "";
  message.className = "message";

  const username = form.username.value.trim();
  const email = form.email.value.trim();
  const password = form.password.value;

  try {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password })
    });

    const payload = await response.json();

    if (!response.ok) {
      message.textContent = payload.message || "Inscription impossible";
      message.classList.add("error");
      return;
    }

    localStorage.setItem("auth_token", payload.token);
    localStorage.setItem("player", JSON.stringify(payload.player));

    message.textContent = "Inscription reussie. Redirection vers le menu...";
    message.classList.add("success");

    setTimeout(() => {
      window.location.href = "/pages/welcome.html";
    }, 700);
  } catch (error) {
    message.textContent = "Erreur reseau, verifie que le serveur tourne";
    message.classList.add("error");
  }
});
