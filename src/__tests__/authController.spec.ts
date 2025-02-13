import { Request, Response } from "express";
import { googleCallback } from "../controllers/authController";
import { AppDataSource } from "../config/data-source";
import { User } from "../entities/user.entity";
import { getJWT } from "../utils/jwt";

jest.mock("../config/data-source", () => ({
  AppDataSource: {
    getRepository: jest.fn(),
  },
}));

jest.mock("../utils/jwt", () => ({
  getJWT: jest.fn(),
}));

describe("googleCallback controller", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let fakeUserRepo: any;

  describe("when user exists", () => {
    beforeEach(() => {
      fakeUserRepo = {
        findOne: jest.fn().mockResolvedValue({
          googleID: "test123",
          email: "test@example.com",
          name: "Test User",
        }),
        create: jest.fn(),
        save: jest.fn(),
      };

      (AppDataSource.getRepository as jest.Mock).mockReturnValue(fakeUserRepo);
      (getJWT as jest.Mock).mockReturnValue("test Token");

      req = {
        user: {
          id: "test123",
          email: "test@example.com",
          name: "Test User",
        },
      };
      res = {
        cookie: jest.fn().mockReturnThis(),
        redirect: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
    });

    it("should redirect with cookie", async () => {
      await googleCallback(req as Request, res as Response);

      expect(res.cookie).toHaveBeenCalledWith("token", "test Token", {
        maxAge: 1000 * 60 * 60,
        sameSite: "none",
        secure: true,
      });
      expect(res.redirect).toHaveBeenCalledWith("http://localhost:3000/api/docs");
    });
  });

  describe("when user does not exist", () => {
    beforeEach(() => {
      jest.clearAllMocks();

      fakeUserRepo = {
        findOne: jest.fn().mockResolvedValue(null),
        create: jest.fn().mockResolvedValue({
          googleID: "test123",
          email: "test@example.com",
          name: "Test User",
        }),
        save: jest.fn(),
      };

      (AppDataSource.getRepository as jest.Mock).mockReturnValue(fakeUserRepo);
      (getJWT as jest.Mock).mockReturnValue("test Token");

      req = {
        user: {
          id: "test123",
          email: "test@example.com",
          name: "Test User",
        },
      };
      res = {
        cookie: jest.fn().mockReturnThis(),
        redirect: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
    });

    it("should create user and redirect with cookie", async () => {
      await googleCallback(req as Request, res as Response);

      expect(AppDataSource.getRepository).toHaveBeenCalledWith(User);
      expect(AppDataSource.getRepository(User).create).toHaveBeenCalledWith({
        googleID: "test123",
        email: "test@example.com",
        name: "Test User",
      });
      expect(AppDataSource.getRepository(User).save).toHaveBeenCalled();
      expect(res.cookie).toHaveBeenCalledWith("token", "test Token", {
        maxAge: 1000 * 60 * 60,
        sameSite: "none",
        secure: true,
      });
      expect(res.redirect).toHaveBeenCalledWith("http://localhost:3000/api/docs");
    });
  });
});
