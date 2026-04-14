const crypto = require("crypto");

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derivedKey}`;
}

function verifyPassword(password, storedHash) {
  const [salt, key] = storedHash.split(":");
  if (!salt || !key) {
    return false;
  }

  const candidateKey = crypto.scryptSync(password, salt, 64);
  const storedKeyBuffer = Buffer.from(key, "hex");

  if (candidateKey.length !== storedKeyBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(candidateKey, storedKeyBuffer);
}

module.exports = {
  hashPassword,
  verifyPassword
};
