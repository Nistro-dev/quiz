import request from "supertest";
import app from "../src/app.js";
import Quiz from "../src/models/quizModel.js";
import { jest } from "@jest/globals";

jest.mock("../src/models/quizModel.js");

describe("Quiz Controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createQuiz", () => {
    it("devrait créer un quiz et retourner 201", async () => {
      const quizData = { title: "Titre", description: "Description" };
      const createdQuiz = { id: 1, ...quizData };

      Quiz.create.mockResolvedValue(createdQuiz);

      const res = await request(app).post("/api/quiz").send(quizData);

      expect(res.status).toBe(201);
      expect(res.body).toEqual(createdQuiz);
      expect(Quiz.create).toHaveBeenCalledWith(quizData);
    });
  });

  describe("getQuizzes", () => {
    it("devrait retourner la liste des quiz", async () => {
      const quizzes = [{ id: 1, title: "Quiz 1" }];
      Quiz.findAll = jest.fn().mockResolvedValue(quizzes);

      const res = await request(app).get("/api/quiz");

      expect(res.status).toBe(200);
      expect(res.body).toEqual(quizzes);
      expect(Quiz.findAll).toHaveBeenCalled();
    });
  });

  describe("getQuizById", () => {
    it("devrait retourner un quiz avec un id", async () => {
      const quiz = { id: 1, title: "Quiz 1" };
      Quiz.findByPk = jest.fn().mockResolvedValue(quiz);

      const res = await request(app).get("/api/quiz/1");

      expect(res.status).toBe(200);
      expect(res.body).toEqual(quiz);
      expect(Quiz.findByPk).toHaveBeenCalledWith("1");
    });

    it("devrait retourner 404 si le quiz n'existe pas", async () => {
      Quiz.findByPk = jest.fn().mockResolvedValue(null);

      const res = await request(app).get("/api/quiz/999");

      expect(res.status).toBe(404);
    });
  });

  describe("updateQuiz", () => {
    it("devrait mettre à jour un quiz", async () => {
      const quizInstance = {
        id: 1,
        title: "Old Title",
        description: "Old Description",
        update: jest.fn().mockImplementation(async function (updatedData) {
          Object.assign(this, updatedData);
          return this;
        }),
      };

      const expectedUpdatedQuiz = {
        id: 1,
        title: "New",
        description: "Desc",
      };

      Quiz.findByPk = jest.fn().mockResolvedValue(quizInstance);

      const res = await request(app)
        .put("/api/quiz/1")
        .send({ title: "New", description: "Desc" });

      expect(res.status).toBe(200);
      expect(res.body).toEqual(expectedUpdatedQuiz);
      expect(quizInstance.update).toHaveBeenCalledWith({
        title: "New",
        description: "Desc",
      });
    });
  });

  describe("deleteQuiz", () => {
    it("devrait supprimer un quiz existant", async () => {
      const quiz = { id: 1, title: "A supprimer" };
      Quiz.destroy = jest.fn().mockResolvedValue(1);

      const res = await request(app).delete("/api/quiz/1");

      expect(res.status).toBe(204);
    });

    it("devrait retourner 404 si le quiz n'existe pas", async () => {
      Quiz.destroy = jest.fn().mockResolvedValue(0);

      const res = await request(app).delete("/api/quiz/999");

      expect(res.status).toBe(404);
    });
  });
});
