import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/userModel.js";

const secret = process.env.JWT_SECRET || "super-secret";

export const register = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.create({ username, passwordHash: password });
    res.status(201).json({ message: "Utilisateur créé", userId: user.id });
  } catch (error) {
    res.status(400).json({ error: "Erreur lors de l'enregistrement" });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ where: { username } });

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ error: "Identifiants invalides" });
  }

  const token = jwt.sign({ userId: user.id, role: user.role }, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1h",
  });

  res.json({ token });
};
