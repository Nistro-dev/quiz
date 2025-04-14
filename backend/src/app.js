import express from "express";
import dotenv from "dotenv";
import quizRoutes from "./routes/quizRoutes.js";
import quizResponseRoutes from "./routes/quizResponseRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";
import authRoute from "./routes/authRoutes.js";
import cors from "cors";


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/quiz", quizRoutes);
app.use("/api/quizResponse", quizResponseRoutes);
app.use("/api/question", questionRoutes);
app.use("/api/auth", authRoute  );

export default app;