import express from "express";
import {
  createQuiz,
  getQuizzes,
  getQuizById,
  updateQuiz,
  deleteQuiz,
} from "../controllers/quizController.js";

const router = express.Router();

router.post("/quiz", createQuiz);
router.get("/quiz", getQuizzes);
router.get("/quiz/:id", getQuizById);
router.put("/quiz/:id", updateQuiz);
router.delete("/quiz/:id", deleteQuiz);

export default router;
