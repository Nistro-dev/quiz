import express from "express";
import dotenv from "dotenv";
import quizRoutes from "./routes/quizRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use("/api", quizRoutes);

export default app;