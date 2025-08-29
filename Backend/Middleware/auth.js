"use-strict";
// Middleware/Auth.js
import { verifyToken } from "../Auth/jwt.js";

const ROLE_WEIGHT = { admin: 1, super_admin: 2 };

export function requireAuth(req, res, next) {
  const authHeader = req.headers["authorization"] || "";
  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({ message: "Missing token" });
  }
  const token = parts[1];
  const decoded = verifyToken(token);
  if (!decoded) return res.status(401).json({ message: "Invalid or expired token" });
  req.user = decoded; // { id, email, isSuperAdmin, role }
  next();
}

export function requireMinRole(minRole = "admin") {
  const min = ROLE_WEIGHT[minRole] ?? 1;
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    const weight = ROLE_WEIGHT[req.user.role] ?? 0;
    if (weight < min) return res.status(403).json({ message: "Forbidden" });
    next();
  };
}

export const requireAdmin = [requireAuth, requireMinRole("admin")];
export const requireSuperAdmin = [requireAuth, requireMinRole("super_admin")];

export default requireAuth;

