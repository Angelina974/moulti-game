const { verifyAuthToken } = require("../utils/jwt");

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || "";

  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token manquant" });
  }

  const token = authHeader.slice(7);

  try {
    const payload = verifyAuthToken(token);
    req.auth = payload;
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Token invalide ou expire" });
  }
}

function requireRole(role) {
  return (req, res, next) => {
    if (!req.auth) {
      return res.status(401).json({ message: "Authentification requise" });
    }

    if (req.auth.role !== role) {
      return res.status(403).json({ message: "Acces refuse pour ce role" });
    }

    return next();
  };
}

module.exports = {
  requireAuth,
  requireRole
};
