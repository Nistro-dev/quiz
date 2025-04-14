import Question from "../models/questionModel.js";

export const createQuestion = async (req, res) => {
  try {
    const { quizId, text, choices, correctAnswerIndex } = req.body;
    const question = await Question.create({
      quizId,
      text,
      choices,
      correctAnswerIndex,
    });
    res.status(201).json(question);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la création de la question" });
  }
};

export const getQuestionsByQuiz = async (req, res) => {
  try {
    const quizId = Number(req.params.id);
    if (isNaN(quizId)) {
      return res.status(400).json({ message: "ID de quiz invalide" });
    }
    const questions = await Question.findAll({ where: { quizId } });
    res.status(200).json(questions);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des questions" });
  }
};

export const updateQuestion = async (req, res) => {
  try {
    const { text, choices, correctAnswerIndex } = req.body;
    const question = await Question.findByPk(req.params.id);
    if (!question) {
      return res.status(404).json({ message: "Question non trouvée" });
    }
    await question.update({ text, choices, correctAnswerIndex });
    res.status(200).json(question);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la mise à jour de la question" });
  }
};

export const deleteQuestion = async (req, res) => {
  try {
    const deletedCount = await Question.destroy({
      where: { id: Number(req.params.id) },
    });
    if (deletedCount === 0) {
      return res.status(404).json({ message: "Question non trouvée" });
    }
    res.status(204).send();
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la suppression de la question" });
  }
};
