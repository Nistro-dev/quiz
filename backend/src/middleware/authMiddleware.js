import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET || "super-secret";

export const authenticate = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token requis" });
  }

  try {
    const decoded = jwt.verify(auth.split(" ")[1], secret);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: "Token invalide" });
  }
};