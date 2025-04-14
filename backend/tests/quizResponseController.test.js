import request from "supertest";
import app from "../src/app.js";
import QuizResponse from "../src/models/quizResponseModel.js";
import { jest } from "@jest/globals";

jest.mock("../src/models/quizResponseModel.js");

describe("QuizResponse Controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createQuizResponse", () => {
    it("devrait créer une réponse et retourner 201", async () => {
      const responseData = {
        quizId: 1,
        userId: "user1",
        responses: [
          { questionId: 1, selectedChoiceIndex: 2 },
          { questionId: 2, selectedChoiceIndex: 1 },
        ],
      };

      const createdResponse = {
        id: 1,
        ...responseData,
        score: 1,
      };

      QuizResponse.create.mockResolvedValue(createdResponse);

      const res = await request(app)
        .post("/api/quizResponse")
        .send(responseData);

      expect(res.status).toBe(201);
      expect(res.body).toEqual(createdResponse);
      expect(QuizResponse.create).toHaveBeenCalledWith(responseData);
    });
  });

  describe("getQuizResponses", () => {
    it("devrait retourner la liste de toutes les réponses", async () => {
      const responses = [
        { id: 1, quizId: 1, userId: "user1", responses: [] },
        { id: 2, quizId: 2, userId: "user2", responses: [] },
      ];

      QuizResponse.findAll = jest.fn().mockResolvedValue(responses);

      const res = await request(app).get("/api/quizResponse");

      expect(res.status).toBe(200);
      expect(res.body).toEqual(responses);
      expect(QuizResponse.findAll).toHaveBeenCalled();
    });
  });

  describe("getQuizResponseById", () => {
    it("devrait retourner une réponse par son ID", async () => {
      const responseObj = { id: 1, quizId: 1, userId: "user1", responses: [] };
      QuizResponse.findByPk = jest.fn().mockResolvedValue(responseObj);

      const res = await request(app).get("/api/quizResponse/1");

      expect(res.status).toBe(200);
      expect(res.body).toEqual(responseObj);
      expect(QuizResponse.findByPk).toHaveBeenCalledWith("1");
    });

    it("devrait retourner 404 si la réponse n'existe pas", async () => {
      QuizResponse.findByPk = jest.fn().mockResolvedValue(null);

      const res = await request(app).get("/api/quizResponse/999");

      expect(res.status).toBe(404);
    });
  });
});
