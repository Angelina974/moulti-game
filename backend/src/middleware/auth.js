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

module.exports = {
  requireAuth
};
