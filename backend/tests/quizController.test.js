import request from "supertest";
import app from "../src/app.js";
import Quiz from "../src/models/quizModel.js";
import { jest } from "@jest/globals";

afterEach(() => {
  jest.clearAllMocks();
});

describe("Additional Quiz Controller Tests", () => {
  describe("createQuiz error handling", () => {
    it("devrait retourner 500 si une erreur se produit lors de la création du quiz", async () => {
      const quizData = { title: "Titre", description: "Description" };
      jest.spyOn(Quiz, "create").mockRejectedValue(new Error("fail"));

      const res = await request(app).post("/api/quiz").send(quizData);

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ message: "Erreur lors de la création du quiz" });
    });
  });

  describe("getQuizzes error handling", () => {
    it("devrait retourner 500 si une erreur se produit lors de la récupération des quizzes", async () => {
      Quiz.findAll = jest.fn().mockRejectedValue(new Error("fail"));

      const res = await request(app).get("/api/quiz");

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ message: "Erreur lors de la récupération des quizzes" });
    });
  });

  describe("getQuizById error handling", () => {
    it("devrait retourner 500 si une erreur se produit lors de la récupération du quiz par id", async () => {
      Quiz.findByPk = jest.fn().mockRejectedValue(new Error("fail"));

      const res = await request(app).get("/api/quiz/1");

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ message: "Erreur lors de la récupération du quiz" });
    });
  });

  describe("getQuizzesByTheme error handling", () => {
    it("devrait retourner 500 si une erreur se produit lors de la récupération des quizzes par thème", async () => {
      const theme = "Mathématiques";
      Quiz.findAll = jest.fn().mockRejectedValue(new Error("fail"));

      const res = await request(app).get(`/api/quiz/theme/${theme}`);

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ message: "Erreur lors de la récupération des quizzes par thème" });
    });
  });

  describe("updateQuiz error handling", () => {
    it("devrait retourner 500 si une erreur se produit lors de la mise à jour du quiz", async () => {
      const quizInstance = {
        id: 1,
        title: "Old Title",
        description: "Old Description",
        update: jest.fn().mockRejectedValue(new Error("fail")),
      };

      Quiz.findByPk = jest.fn().mockResolvedValue(quizInstance);

      const res = await request(app)
        .put("/api/quiz/1")
        .send({ title: "New", description: "Desc" });

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ message: "Erreur lors de la mise à jour du quiz" });
    });
  });

  describe("deleteQuiz error handling", () => {
    it("devrait retourner 500 si une erreur se produit lors de la suppression du quiz", async () => {
      Quiz.destroy = jest.fn().mockRejectedValue(new Error("fail"));

      const res = await request(app).delete("/api/quiz/1");

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ message: "Erreur lors de la suppression du quiz" });
    });
  });
});
