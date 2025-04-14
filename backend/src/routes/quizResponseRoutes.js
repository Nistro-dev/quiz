import express from "express";
import {
  createQuizResponse,
  getQuizResponses,
  deleteQuizResponse,
  getQuizResponseById,
  updateQuizResponse
} from "../controllers/quizResponseController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .post(authenticate, createQuizResponse)
  .get(getQuizResponses);
router
  .route("/:id")
  .get(getQuizResponseById)
  .delete(authenticate, deleteQuizResponse)
  .put(authenticate, updateQuizResponse);

export default router;
