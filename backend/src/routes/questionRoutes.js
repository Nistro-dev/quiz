import express from "express";
import {
  createQuestion,
  getQuestionsByQuiz,
  deleteQuestion,
  updateQuestion
} from "../controllers/questionController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .post(authenticate, createQuestion)
router
  .route("/:id")
  .delete(authenticate, deleteQuestion)
  .put(authenticate, updateQuestion);

export default router;
