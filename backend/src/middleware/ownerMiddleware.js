import Quiz from "../models/quizModel.js";
import { extractUserIdFromToken, extractRoleFromToken } from "./tokenUtil.js";

export const isQuizOwner = async (req, res, next) => {
  try {
    const userId = extractUserIdFromToken(req);
    const role = extractRoleFromToken(req);

    console.log("User ID:", userId);

    if (!userId) {
      return res.status(401).json({ error: "Token requis ou invalide" });
    }

    const quizId = req.params.id;
    const quiz = await Quiz.findByPk(quizId);

    if (!quiz) {
      return res.status(404).json({ error: "Quiz non trouvé" });
    }

    if (role === "admin") {
      return next();
    }

    console.log("Quiz Owner ID:", quiz.ownerId);
    console.log("User Role:", role);

    if (quiz.ownerId !== userId) {
      return res.status(403).json({
        error: "Accès refusé, vous n'êtes pas le propriétaire de ce quiz",
      });
    }

    next();
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors de la vérification de propriété" });
  }
};
