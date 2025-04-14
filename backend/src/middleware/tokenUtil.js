import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET || "super-secret";

export const extractUserIdFromToken = (req) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    return null;
  }

  try {
    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, secret);
    return decoded.userId;
  } catch (error) {
    return null;
  }
};

export const extractRoleFromToken = (req) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    return null;
  }

  try {
    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, secret);
    return decoded.role;
  } catch (error) {
    return null;
  }
}