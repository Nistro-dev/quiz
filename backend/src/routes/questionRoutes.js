import express from "express";
import {
  createQuestion,
  getQuestionsByQuiz,
  deleteQuestion,
  updateQuestion
} from "../controllers/questionController.js";

const router = express.Router();

router
  .route("/")
  .post(createQuestion)
router
  .route("/:id")
  .delete(deleteQuestion)
  .put(updateQuestion);

export default router;
