// Auth/Jwt.js
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET ?? "fallbacksecret";
const EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? "1d";

export function createToken(admin) {
  return jwt.sign(
    { id: admin.id, email: admin.email, isSuperAdmin: admin.isSuperAdmin },
    SECRET,
    { expiresIn: EXPIRES_IN }
  );
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
}

export function getUserFromToken(token) {
  const decoded = verifyToken(token);
  if (!decoded) return null;
  return { id: decoded.id, email: decoded.email, isSuperAdmin: decoded.isSuperAdmin };
}

export function getUserIdFromToken(token) {
  const decoded = verifyToken(token);
  return decoded ? decoded.id : null;
}

// (optional) default export if you like default-style imports elsewhere
export default { createToken, verifyToken, getUserFromToken, getUserIdFromToken };
