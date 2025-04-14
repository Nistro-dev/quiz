import request from "supertest";
import app from "../src/app.js";
import Question from "../src/models/questionModel.js";
import { jest } from "@jest/globals";
import jwt from "jsonwebtoken";

const testToken = jwt.sign(
  { userId: 1, role: "user" },
  process.env.JWT_SECRET || "super-secret"
);

jest.mock("../src/models/questionModel.js");

describe("Question Controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createQuestion", () => {
    it("devrait créer une question et retourner 201", async () => {
      const questionData = {
        quizId: 1,
        text: "Quel est la capitale de la France ?",
        choices: ["Paris", "Lyon", "Marseille"],
        correctAnswerIndex: 0,
      };
      const createdQuestion = { id: 1, ...questionData };

      Question.create.mockResolvedValue(createdQuestion);

      const res = await request(app)
        .post("/api/question")
        .set("Authorization", `Bearer ${testToken}`)
        .send(questionData);

      expect(res.status).toBe(201);
      expect(res.body).toEqual(createdQuestion);
      expect(Question.create).toHaveBeenCalledWith(questionData);
    });
  });

  describe("getQuestionsByQuiz", () => {
    it("devrait retourner la liste des questions d'un quiz", async () => {
      const questions = [
        { id: 1, text: "Quel est la capitale de la France ?", quizId: 1 },
      ];
      Question.findAll = jest.fn().mockResolvedValue(questions);

      const res = await request(app).get("/api/quiz/1/questions");

      expect(res.status).toBe(200);
      expect(res.body).toEqual(questions);
      expect(Question.findAll).toHaveBeenCalledWith({ where: { quizId: 1 } });
    });
  });

  describe("updateQuestion", () => {
    it("devrait mettre à jour une question", async () => {
      const questionInstance = {
        id: 1,
        text: "Old text",
        choices: ["A", "B", "C"],
        correctAnswerIndex: 1,
        update: jest.fn().mockImplementation(async function (updatedData) {
          Object.assign(this, updatedData);
          return this;
        }),
      };

      const expectedUpdatedQuestion = {
        id: 1,
        text: "New text",
        choices: ["A", "B", "C"],
        correctAnswerIndex: 2,
      };

      Question.findByPk = jest.fn().mockResolvedValue(questionInstance);

      const res = await request(app)
        .put("/api/question/1")
        .set("Authorization", `Bearer ${testToken}`)
        .send({
          text: "New text",
          choices: ["A", "B", "C"],
          correctAnswerIndex: 2,
        });

      expect(res.status).toBe(200);
      expect(res.body).toEqual(expectedUpdatedQuestion);
      expect(Question.findByPk).toHaveBeenCalledWith("1");
      expect(questionInstance.update).toHaveBeenCalledWith({
        text: "New text",
        choices: ["A", "B", "C"],
        correctAnswerIndex: 2,
      });
    });
  });

  describe("deleteQuestion", () => {
    it("devrait supprimer une question", async () => {
      Question.destroy = jest.fn().mockResolvedValue(1);

      const res = await request(app)
        .delete("/api/question/1")
        .set("Authorization", `Bearer ${testToken}`);

      expect(res.status).toBe(204);
      expect(Question.destroy).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it("devrait retourner 404 si la question n'est pas trouvée", async () => {
      Question.destroy = jest.fn().mockResolvedValue(0);

      const res = await request(app)
        .delete("/api/question/999")
        .set("Authorization", `Bearer ${testToken}`);

      expect(res.status).toBe(404);
    });
  });
});
