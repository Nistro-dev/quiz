import express from "express";
import {
  createQuizResponse,
  getQuizResponses,
  deleteQuizResponse,
  getQuizResponseById,
  updateQuizResponse
} from "../controllers/quizResponseController.js";

const router = express.Router();

router
  .route("/")
  .post(createQuizResponse)
  .get(getQuizResponses);
router
  .route("/:id")
  .get(getQuizResponseById)
  .delete(deleteQuizResponse)
  .put(updateQuizResponse);

export default router;
