import request from "supertest";
import app from "../src/app.js";
import QuizResponse from "../src/models/quizResponseModel.js";
import jwt from "jsonwebtoken";
import { jest } from "@jest/globals";

jest.mock("../src/models/quizResponseModel.js");
jest.mock("jsonwebtoken");

describe("QuizResponse Controller", () => {
  const mockToken = "mock.jwt.token";
  const mockUserId = "user1";
  
  beforeEach(() => {
    jwt.verify = jest.fn().mockReturnValue({ userId: mockUserId, role: "user" });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createQuizResponse", () => {
    it("devrait créer une réponse et retourner 201", async () => {
      const responseData = {
        quizId: 1,
        responses: [
          { questionId: 1, selectedChoiceIndex: 2 },
          { questionId: 2, selectedChoiceIndex: 1 },
        ],
      };

      const createdResponse = {
        id: 1,
        quizId: 1,
        userId: mockUserId,
        responses: responseData.responses,
        score: 1,
      };

      QuizResponse.create.mockResolvedValue(createdResponse);

      const res = await request(app)
        .post("/api/quizResponse")
        .set("Authorization", `Bearer ${mockToken}`)
        .send(responseData);

      expect(res.status).toBe(201);
      expect(res.body).toEqual(createdResponse);
      expect(QuizResponse.create).toHaveBeenCalledWith({
        quizId: responseData.quizId,
        userId: mockUserId,
        responses: responseData.responses,
      });
    });

    it("devrait retourner 401 si le token est manquant", async () => {
      const res = await request(app)
        .post("/api/quizResponse")
        .send({ quizId: 1, responses: [] });

      expect(res.status).toBe(401);
    });

    it("devrait retourner 500 si une erreur se produit lors de la création de la réponse", async () => {
      QuizResponse.create.mockRejectedValue(new Error("Database error"));

      const res = await request(app)
        .post("/api/quizResponse")
        .set("Authorization", `Bearer ${mockToken}`)
        .send({ quizId: 1, responses: [] });

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ message: "Erreur lors de la création de la réponse" });
    });
  });

  describe("getQuizResponses", () => {
    it("devrait retourner la liste de toutes les réponses", async () => {
      const responses = [
        { id: 1, quizId: 1, userId: "user1", responses: [] },
        { id: 2, quizId: 2, userId: "user2", responses: [] },
      ];

      QuizResponse.findAll.mockResolvedValue(responses);

      const res = await request(app).get("/api/quizResponse");

      expect(res.status).toBe(200);
      expect(res.body).toEqual(responses);
      expect(QuizResponse.findAll).toHaveBeenCalled();
    });

    it("devrait retourner 500 si une erreur se produit lors de la récupération des réponses", async () => {
      QuizResponse.findAll.mockRejectedValue(new Error("Database error"));

      const res = await request(app).get("/api/quizResponse");

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ message: "Erreur lors de la récupération des réponses" });
    });
  });

  describe("getQuizResponseById", () => {
    it("devrait retourner une réponse par son ID", async () => {
      const responseObj = { id: 1, quizId: 1, userId: "user1", responses: [] };
      QuizResponse.findByPk.mockResolvedValue(responseObj);

      const res = await request(app).get("/api/quizResponse/1");

      expect(res.status).toBe(200);
      expect(res.body).toEqual(responseObj);
      expect(QuizResponse.findByPk).toHaveBeenCalledWith("1");
    });

    it("devrait retourner 404 si la réponse n'existe pas", async () => {
      QuizResponse.findByPk.mockResolvedValue(null);

      const res = await request(app).get("/api/quizResponse/999");

      expect(res.status).toBe(404);
    });

    it("devrait retourner 500 si une erreur se produit lors de la récupération", async () => {
      QuizResponse.findByPk.mockRejectedValue(new Error("Database error"));
      
      const res = await request(app).get("/api/quizResponse/1");
      
      expect(res.status).toBe(500);
      expect(res.body).toEqual({ message: "Erreur lors de la récupération de la réponse" });
    });
  });

  describe("updateQuizResponse", () => {
    it("devrait mettre à jour une réponse", async () => {
      const responseInstance = {
        id: 1,
        quizId: 1,
        userId: mockUserId,
        responses: [{ questionId: 1, selectedChoiceIndex: 0 }],
        update: jest.fn().mockImplementation(async function (updatedData) {
          Object.assign(this, updatedData);
          return this;
        }),
      };

      const updatedData = {
        responses: [
          { questionId: 1, selectedChoiceIndex: 1 },
          { questionId: 2, selectedChoiceIndex: 2 },
        ],
      };

      QuizResponse.findByPk.mockResolvedValue(responseInstance);

      const res = await request(app)
        .put("/api/quizResponse/1")
        .set("Authorization", `Bearer ${mockToken}`)
        .send(updatedData);

      expect(res.status).toBe(200);
      expect(responseInstance.update).toHaveBeenCalledWith(updatedData);
    });

    it("devrait retourner 401 si le token est manquant", async () => {
      const res = await request(app)
        .put("/api/quizResponse/1")
        .send({ responses: [] });

      expect(res.status).toBe(401);
    });

    it("devrait retourner 404 si la réponse n'existe pas", async () => {
      QuizResponse.findByPk.mockResolvedValue(null);

      const res = await request(app)
        .put("/api/quizResponse/999")
        .set("Authorization", `Bearer ${mockToken}`)
        .send({ responses: [] });

      expect(res.status).toBe(404);
    });

    it("devrait retourner 500 si une erreur se produit lors de la mise à jour", async () => {
      const responseInstance = {
        update: jest.fn().mockRejectedValue(new Error("Database error")),
      };

      QuizResponse.findByPk.mockResolvedValue(responseInstance);

      const res = await request(app)
        .put("/api/quizResponse/1")
        .set("Authorization", `Bearer ${mockToken}`)
        .send({ responses: [] });

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ message: "Erreur lors de la mise à jour de la réponse" });
    });
  });

  describe("deleteQuizResponse", () => {
    it("devrait supprimer une réponse", async () => {
      QuizResponse.destroy.mockResolvedValue(1);

      const res = await request(app)
        .delete("/api/quizResponse/1")
        .set("Authorization", `Bearer ${mockToken}`);

      expect(res.status).toBe(204);
      expect(QuizResponse.destroy).toHaveBeenCalledWith({ where: { id: "1" } });
    });

    it("devrait retourner 401 si le token est manquant", async () => {
      const res = await request(app).delete("/api/quizResponse/1");

      expect(res.status).toBe(401);
    });

    it("devrait retourner 404 si la réponse n'existe pas", async () => {
      QuizResponse.destroy.mockResolvedValue(0);

      const res = await request(app)
        .delete("/api/quizResponse/999")
        .set("Authorization", `Bearer ${mockToken}`);

      expect(res.status).toBe(404);
    });

    it("devrait retourner 500 si une erreur se produit lors de la suppression", async () => {
      QuizResponse.destroy.mockRejectedValue(new Error("Database error"));

      const res = await request(app)
        .delete("/api/quizResponse/1")
        .set("Authorization", `Bearer ${mockToken}`);

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ message: "Erreur lors de la suppression de la réponse" });
    });
  });
});
