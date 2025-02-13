import request from "supertest";
import { NextFunction, Request, Response } from "express";
import { app } from "../app";
import { AppDataSource } from "../config/data-source";
import { getLongUrl, shortenUrl } from "../services/urlService";
import { authMiddleware } from "../middlewares/auth";
import * as http from "http";
import { nanoid } from "nanoid";
import { addUniqueUser } from "../services/urlService";

jest.mock("../services/urlService", () => ({
  shortenUrl: jest.fn().mockResolvedValue({
    alias: "testAlias",
    createdAt: "22-12-2002",
  }),
  getLongUrl: jest.fn(),
  addUniqueUser: jest.fn(),
}));

jest.mock("../middlewares/auth", () => ({
  authMiddleware: jest.fn(),
}));

jest.mock("nanoid", () => ({
  nanoid: jest.fn()
}));

let testServer: http.Server;
beforeAll(() => {
  testServer = app.listen(8000); // Start the server on port 5001 before the tests
});
afterAll(() => testServer.close());

describe("POST /api/shorten", () => {
  describe("Request is authorised", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should return shortened URL", async () => {
      (shortenUrl as jest.Mock).mockResolvedValue({
        alias: "testAlias",
        createdAt: "22-12-2002",
      });
      (authMiddleware as jest.Mock).mockImplementation(
        (req: Request, res: Response, next: NextFunction) => {
          req.user = {
            id: "testUserId",
            email: "test@example.com",
            name: "Test User",
          };
          next();
        }
      );
      const response = await request(app).post("/api/shorten").send({
        longUrl: "https://example.com",
        customAlias: "testAlias",
        topic: "testTopic",
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("shortUrl", "testAlias");
      expect(response.body).toHaveProperty("createdAt", "22-12-2002");
    });
  });

  describe("Request is not authorised", () => {
    beforeEach(() => {
      jest.clearAllMocks();

      (authMiddleware as jest.Mock).mockImplementation(
        (req: Request, res: Response, next: NextFunction) => {
          res.status(403).json({ error: "Invalid token, login again" });
        }
      );
    });

    it("should return error", async () => {
      (shortenUrl as jest.Mock).mockResolvedValue({
        alias: "testAlias",
        createdAt: "22-12-2002",
      });
      const response = await request(app).post("/api/shorten").send({
        longUrl: "https://example.com",
        customAlias: "testAlias",
        topic: "testTopic",
      });

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty("error", "Invalid token, login again");
    });
  });
});

describe("GET /api/shorted/:alias", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should redirect with longUrl if uniqueUserId exists", async () => {
    (getLongUrl as jest.Mock).mockResolvedValue("https://testurl.com");

    const response = await request(app)
      .get("/api/shorten/testAlias")
      .set("Cookie", "uniqueUserId=testUUID")
      .set("user-agent", "TestAgent");

    expect(getLongUrl).toHaveBeenCalledWith("testAlias", "TestAgent", "testUUID");
    expect(response.status).toBe(302);
    expect(response.header.location).toBe("https://testurl.com");
    expect(response.headers["set-cookie"]).toBeUndefined();
    expect(addUniqueUser).toHaveBeenCalledWith("testAlias", "testUUID");
  });

  it("should generate a new uniqueUserId, set a cookie, and redirect if uniqueUserId is not present", async () => {
    (getLongUrl as jest.Mock).mockResolvedValue("https://testurl.com");
    (nanoid as jest.Mock).mockReturnValue("testUUID")

    const response = await request(app)
      .get("/api/shorten/testAlias")
      .set("user-agent", "TestAgent");

    expect(getLongUrl).toHaveBeenCalledWith("testAlias", "TestAgent", "");
    expect(nanoid).toHaveBeenCalledWith(10);
    expect(response.status).toBe(302);
    expect(response.header.location).toBe("https://testurl.com");
    expect(response.headers["set-cookie"]).toEqual(["uniqueUserId=testUUID; Path=/"]);
    expect(addUniqueUser).toHaveBeenCalledWith("testAlias", "testUUID");
  });

  it("should return a 400 error if no longURL is present throws an error", async () => {
    const error = new Error("Invalid Url");
    (getLongUrl as jest.Mock).mockRejectedValue(error)

    const response = await request(app)
      .get("/api/shorten/invalidAlias")
      .set("user-agent", "TestAgent");
    
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error", "Invalid Url");
   })
});
