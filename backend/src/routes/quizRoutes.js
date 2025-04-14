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
import { authenticate } from "../middleware/authMiddleware.js";
import { isQuizOwner } from "../middleware/ownerMiddleware.js";

const router = express.Router();

router
  .route("/")
  .post(authenticate, createQuiz)
  .get(getQuizzes);
router
  .route("/:id")
  .get(getQuizById)
  .delete(authenticate, isQuizOwner, deleteQuiz)
  .put(authenticate, isQuizOwner, updateQuiz);
router
  .route("/theme/:theme")
  .get(getQuizzesByTheme);
router
  .route("/:id/questions")
  .get(getQuestionsByQuiz);

export default router;
