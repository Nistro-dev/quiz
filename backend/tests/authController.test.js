import request from "supertest";
import app from "../src/app.js";
import User from "../src/models/userModel.js";
jest.mock("../src/models/userModel.js");
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { jest } from "@jest/globals";
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

describe("Auth Controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("register", () => {
    it("devrait créer un utilisateur et retourner 201", async () => {
      const userData = {
        username: "testuser",
        password: "password123"
      };

      const createdUser = {
        id: 1,
        username: "testuser",
        passwordHash: "hashedpassword",
        role: "user"
      };

      User.create.mockResolvedValue(createdUser);

      const res = await request(app)
        .post("/api/auth/register")
        .send(userData);

      expect(res.status).toBe(201);
      expect(res.body).toEqual({
        message: "Utilisateur créé",
        userId: createdUser.id
      });
      expect(User.create).toHaveBeenCalledWith({
        username: userData.username,
        passwordHash: userData.password
      });
    });

    it("devrait retourner 400 si une erreur se produit lors de l'enregistrement", async () => {
      User.create.mockRejectedValue(new Error("Username déjà utilisé"));

      const res = await request(app)
        .post("/api/auth/register")
        .send({ username: "existinguser", password: "password123" });

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: "Erreur lors de l'enregistrement" });
    });

    it("devrait retourner 400 si les données d'utilisateur sont incomplètes", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({ username: "testuser" });

      expect(res.status).toBe(400);
    });
  });

  describe("login", () => {
    it("devrait connecter un utilisateur et retourner un token", async () => {
      const userData = {
        username: "testuser",
        password: "password123"
      };

      const foundUser = {
        id: 1,
        username: "testuser",
        passwordHash: "hashedpassword",
        role: "user"
      };

      const mockToken = "fake.jwt.token";

      User.findOne.mockResolvedValue(foundUser);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue(mockToken);

      const res = await request(app)
        .post("/api/auth/login")
        .send(userData);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ token: mockToken });
      expect(User.findOne).toHaveBeenCalledWith({ where: { username: userData.username } });
      expect(bcrypt.compare).toHaveBeenCalledWith(userData.password, foundUser.passwordHash);
      expect(jwt.sign).toHaveBeenCalledWith(
        { userId: foundUser.id, role: foundUser.role },
        expect.any(String),
        { expiresIn: expect.any(String) }
      );
    });

    it("devrait retourner 401 si le nom d'utilisateur est incorrect", async () => {
      User.findOne.mockResolvedValue(null);

      const res = await request(app)
        .post("/api/auth/login")
        .send({ username: "wronguser", password: "password123" });

      expect(res.status).toBe(401);
      expect(res.body).toEqual({ error: "Identifiants invalides" });
    });

    it("devrait retourner 401 si le mot de passe est incorrect", async () => {
      const foundUser = {
        id: 1,
        username: "testuser",
        passwordHash: "hashedpassword",
        role: "user"
      };

      User.findOne.mockResolvedValue(foundUser);
      bcrypt.compare.mockResolvedValue(false);

      const res = await request(app)
        .post("/api/auth/login")
        .send({ username: "testuser", password: "wrongpassword" });

      expect(res.status).toBe(401);
      expect(res.body).toEqual({ error: "Identifiants invalides" });
    });

    it("devrait retourner 400 si les données de connexion sont incomplètes", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ username: "testuser" });

      expect(res.status).toBe(400);
    });
  });
});