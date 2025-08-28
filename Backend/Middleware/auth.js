"use-strict"
// Middleware/Auth.js
import { verifyToken } from "../Auth/jwt.js";

function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ message: "Missing token" });

  const token = authHeader.split(" ")[1]; // "Bearer <token>"
  const decoded = verifyToken(token);
  if (!decoded) return res.status(401).json({ message: "Invalid or expired token" });

  req.user = decoded;
  next();
}

export default authMiddleware;


