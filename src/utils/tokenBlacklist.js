import jwt from "jsonwebtoken";

// Simple in-memory token blacklist with automatic cleanup.
// Note: in-memory blacklist will be lost on process restart. For production,
// persist to Redis or database.

const blacklist = new Map(); // token -> expiryTimestamp(ms)

const addToken = (token) => {
  try {
    const decoded = jwt.decode(token);
    // decoded.exp is in seconds since epoch
    const expMs =
      decoded && decoded.exp
        ? decoded.exp * 1000
        : Date.now() + 24 * 3600 * 1000;
    blacklist.set(token, expMs);
  } catch (err) {
    // If decode fails, add token with 1 day TTL
    blacklist.set(token, Date.now() + 24 * 3600 * 1000);
  }
};

const isBlacklisted = (token) => {
  if (!token) return false;
  const exp = blacklist.get(token);
  if (!exp) return false;
  if (Date.now() > exp) {
    // expired in blacklist -> remove
    blacklist.delete(token);
    return false;
  }
  return true;
};

// Periodic cleanup to avoid memory leak
setInterval(() => {
  const now = Date.now();
  for (const [token, exp] of blacklist.entries()) {
    if (now > exp) blacklist.delete(token);
  }
}, 60 * 60 * 1000); // every hour

export { addToken, isBlacklisted };
