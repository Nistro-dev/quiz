import request from "supertest";
import app from "../src/app.js";
import Quiz from "../src/models/quizModel.js";
import { jest } from "@jest/globals";
import jwt from "jsonwebtoken";
const testToken = jwt.sign(
  { userId: 1, role: "user" },
  process.env.JWT_SECRET || "super-secret"
);

afterEach(() => {
  jest.clearAllMocks();
});

describe("Additional Quiz Controller Tests", () => {
  describe("createQuiz error handling", () => {
    it("devrait retourner 500 si une erreur se produit lors de la création du quiz", async () => {
      const quizData = { title: "Titre", description: "Description" };
      jest.spyOn(Quiz, "create").mockRejectedValue(new Error("fail"));

      const res = await request(app)
        .post("/api/quiz")
        .set("Authorization", `Bearer ${testToken}`)
        .send(quizData);

      expect(res.status).toBe(500);
      expect(res.body).toEqual({
        message: "Erreur lors de la création du quiz",
      });
    });
  });

  describe("getQuizzes error handling", () => {
    it("devrait retourner 500 si une erreur se produit lors de la récupération des quizzes", async () => {
      Quiz.findAll = jest.fn().mockRejectedValue(new Error("fail"));

      const res = await request(app)
        .get("/api/quiz")
        .set("Authorization", `Bearer ${testToken}`);

      expect(res.status).toBe(500);
      expect(res.body).toEqual({
        message: "Erreur lors de la récupération des quizzes",
      });
    });
  });

  describe("getQuizById error handling", () => {
    it("devrait retourner 500 si une erreur se produit lors de la récupération du quiz par id", async () => {
      Quiz.findByPk = jest.fn().mockRejectedValue(new Error("fail"));

      const res = await request(app)
        .get("/api/quiz/1")
        .set("Authorization", `Bearer ${testToken}`);

      expect(res.status).toBe(500);
      expect(res.body).toEqual({
        message: "Erreur lors de la récupération du quiz",
      });
    });
  });

  describe("getQuizzesByTheme error handling", () => {
    it("devrait retourner 500 si une erreur se produit lors de la récupération des quizzes par thème", async () => {
      const theme = "Mathématiques";
      Quiz.findAll = jest.fn().mockRejectedValue(new Error("fail"));

      const res = await request(app)
        .get(`/api/quiz/theme/${theme}`)
        .set("Authorization", `Bearer ${testToken}`);

      expect(res.status).toBe(500);
      expect(res.body).toEqual({
        message: "Erreur lors de la récupération des quizzes par thème",
      });
    });
  });

  afterAll(async () => {
    await Quiz.sequelize.close();
  });
});