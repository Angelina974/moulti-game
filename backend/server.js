const express = require("express");
const path = require("path");
const { createUser, findByEmail, findById } = require("./src/services/userStore");
const { hashPassword, verifyPassword } = require("./src/utils/password");
const { createAuthToken, JWT_EXPIRES_IN } = require("./src/utils/jwt");
const { requireAuth } = require("./src/middleware/auth");
const { initDatabase, pool } = require("./src/db");

const app = express();
const PORT = process.env.PORT || 3000;
const frontendRoot = path.join(__dirname, "..", "frontend");

app.use(express.json());
app.use(express.static(frontendRoot));

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/auth/register", async (req, res) => {
  try {
    const { username, email, password } = req.body || {};

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "username, email et password sont requis"
      });
    }

    if (String(password).length < 6) {
      return res.status(400).json({
        message: "Le mot de passe doit contenir au moins 6 caracteres"
      });
    }

    const result = await createUser({
      username: String(username).trim(),
      email: String(email).trim(),
      passwordHash: hashPassword(String(password))
    });

    if (result.error === "EMAIL_ALREADY_EXISTS") {
      return res.status(409).json({
        message: "Un compte existe deja avec cet email"
      });
    }

    const { user } = result;
    const token = createAuthToken(user);

    return res.status(201).json({
      message: "Inscription reussie",
      token,
      expiresIn: JWT_EXPIRES_IN,
      player: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({
        message: "email et password sont requis"
      });
    }

    const user = await findByEmail(String(email).trim());
    if (!user) {
      return res.status(401).json({ message: "Identifiants invalides" });
    }

    const ok = verifyPassword(String(password), user.passwordHash);
    if (!ok) {
      return res.status(401).json({ message: "Identifiants invalides" });
    }

    const token = createAuthToken(user);

    return res.status(200).json({
      message: "Connexion reussie",
      token,
      expiresIn: JWT_EXPIRES_IN,
      player: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

app.get("/api/auth/me", requireAuth, async (req, res) => {
  try {
    const user = await findById(req.auth.sub);

    if (!user) {
      return res.status(404).json({ message: "Joueur introuvable" });
    }

    return res.status(200).json({
      player: {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

app.get("/api/protected/ping", requireAuth, (req, res) => {
  res.status(200).json({
    message: "Route protegee accessible",
    auth: {
      id: req.auth.sub,
      username: req.auth.username,
      email: req.auth.email
    }
  });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(frontendRoot, "index.html"));
});

async function startServer() {
  try {
    await initDatabase();
    app.listen(PORT, () => {
      console.log(`Backend listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to initialize PostgreSQL connection:", error.message);
    process.exit(1);
  }
}

startServer();

process.on("SIGINT", async () => {
  await pool.end();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await pool.end();
  process.exit(0);
});
