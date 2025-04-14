import express from "express";
import {
  createQuiz,
  getQuizzes,
  deleteQuiz,
  getQuizById,
  getQuizzesByTheme,
  updateQuiz
} from "../controllers/quizController.js";
import { getQuestionsByQuiz } from "../controllers/questionController.js";

const router = express.Router();

router
  .route("/")
  .post(createQuiz)
  .get(getQuizzes);
router
  .route("/:id")
  .get(getQuizById)
  .delete(deleteQuiz)
  .put(updateQuiz);
router
  .route("/theme/:theme")
  .get(getQuizzesByTheme);
router
  .route("/:id/questions")
  .get(getQuestionsByQuiz);

export default router;
