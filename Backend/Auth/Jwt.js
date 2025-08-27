import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "fallbacksecret";
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";

// Create JWT for an admin
function createToken(admin) {
  return jwt.sign(
    {
      id: admin.id,
      email: admin.email,
      isSuperAdmin: admin.isSuperAdmin,
    },
    SECRET,
    { expiresIn: EXPIRES_IN }
  );
}

function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch (err) {
    return null; 
  }
}

function getUserFromToken(token) {
  const decoded = verifyToken(token);
  if (!decoded) return null;
  return {
    id: decoded.id,
    email: decoded.email,
    isSuperAdmin: decoded.isSuperAdmin,
  };
}


function getUserIdFromToken(token) {
  const decoded = verifyToken(token);
  return decoded ? decoded.id : null;
}

module.exports = {
  createToken,
  verifyToken,
  getUserFromToken,
  getUserIdFromToken,
};
