import QuizResponse from "../models/quizResponseModel.js";
import { extractUserIdFromToken } from "../middleware/tokenUtil.js";

export const createQuizResponse = async (req, res) => {
  try {
    const { quizId, responses } = req.body;
    const userId = extractUserIdFromToken(req);

    if (!userId) {
      return res.status(401).json({ message: "Token invalide ou manquant" });
    }

    const quizResponse = await QuizResponse.create({
      quizId,
      userId,
      responses,
    });
    res.status(201).json(quizResponse);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la création de la réponse" });
  }
};

export const getQuizResponses = async (req, res) => {
  try {
    const quizResponses = await QuizResponse.findAll();
    res.status(200).json(quizResponses);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des réponses" });
  }
};

export const getQuizResponseById = async (req, res) => {
  try {
    const quizResponse = await QuizResponse.findByPk(req.params.id);
    if (!quizResponse) {
      return res.status(404).json({ message: "Réponse non trouvée" });
    }
    res.status(200).json(quizResponse);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération de la réponse" });
  }
};

export const updateQuizResponse = async (req, res) => {
  try {
    const { responses } = req.body;
    const quizResponse = await QuizResponse.findByPk(req.params.id);
    if (!quizResponse) {
      return res.status(404).json({ message: "Réponse non trouvée" });
    }
    await quizResponse.update({ responses });
    res.status(200).json(quizResponse);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la mise à jour de la réponse" });
  }
};

export const deleteQuizResponse = async (req, res) => {
  try {
    const deletedCount = await QuizResponse.destroy({
      where: { id: req.params.id },
    });
    if (deletedCount === 0) {
      return res.status(404).json({ message: "Réponse non trouvée" });
    }
    res.status(204).send();
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la suppression de la réponse" });
  }
};
