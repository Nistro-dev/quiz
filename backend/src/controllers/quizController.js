import Quiz from "../models/quizModel.js";

export const createQuiz = async (req, res) => {
  try {
    const { title, description } = req.body;
    const quiz = await Quiz.create({ title, description });
    res.status(201).json(quiz);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la création du quiz" });
  }
};

export const getQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.findAll();
    res.status(200).json(quizzes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la récupération des quizzes" });
  }
};

export const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findByPk(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz non trouvé" });
    }
    res.status(200).json(quiz);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la récupération du quiz" });
  }
};

export const updateQuiz = async (req, res) => {
  try {
    const { title, description } = req.body;
    const quiz = await Quiz.findByPk(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz non trouvé" });
    }
    await quiz.update({ title, description });
    res.status(200).json(quiz);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la mise à jour du quiz" });
  }
};

export const deleteQuiz = async (req, res) => {
  try {
    const deletedCount = await Quiz.destroy({ where: { id: req.params.id } });
    if (deletedCount === 0) {
      return res.status(404).json({ message: "Quiz non trouvé" });
    }
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la suppression du quiz" });
  }
};
