import request from "supertest";
import { app } from "../app";
import { getAnalyticsFromAlias, getAnalyticsFromTopic, getAllAnalytics } from "../services/analyticService";
import * as http from "http";
import { authMiddleware } from "../middlewares/auth";
import { NextFunction, Request, Response } from "express";

jest.mock("../middlewares/auth", () => ({
  authMiddleware: jest.fn(),
}));

jest.mock("../services/analyticService", () => ({
  getAnalyticsFromAlias: jest.fn(),
  getAnalyticsFromTopic: jest.fn(),
  getAllAnalytics: jest.fn()
}));

let testServer: http.Server;
beforeAll(() => {
  testServer = app.listen(8000);
});
afterAll(() => testServer.close());

describe("GET /api/analytics/:alias", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return analytics data for a given alias and authenticated user", async () => {
    (getAnalyticsFromAlias as jest.Mock).mockResolvedValue({
      totalClicks: 100,
      uniqueUsers: 50,
      clicksByDate: [{ date: "2025-02-07", clicks: 10 }],
      deviceType: [{ deviceName: "mobile", uniqueClicks: 20, uniqueUsers: 15 }],
      osType: [{ osName: "Android", uniqueClicks: 30, uniqueUsers: 25 }],
    });
    (authMiddleware as jest.Mock).mockImplementation(
      (req: Request, res: Response, next: NextFunction) => {
        req.user = {
          googleID: "testUserId",
          email: "test@example.com",
          name: "Test User",
        };
        next();
      }
    );

    const response = await request(app)
      .get("/api/analytics/testAlias")
      .set("user-agent", "TestAgent")
      .set("Cookie", "token=testToken");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      totalClicks: 100,
      uniqueUsers: 50,
      clicksByDate: [{ date: "2025-02-07", clicks: 10 }],
      deviceType: [{ deviceName: "mobile", uniqueClicks: 20, uniqueUsers: 15 }],
      osType: [{ osName: "Android", uniqueClicks: 30, uniqueUsers: 25 }],
    });
    expect(getAnalyticsFromAlias).toHaveBeenCalledWith("testAlias", "testUserId");
  });

  it("should return error if inalvid alias is passed", async () => {
    (getAnalyticsFromAlias as jest.Mock).mockRejectedValue(new Error("Invalid url"));
    (authMiddleware as jest.Mock).mockImplementation(
      (req: Request, res: Response, next: NextFunction) => {
        req.user = {
          googleID: "testUserId",
          email: "test@example.com",
          name: "Test User",
        };
        next();
      }
    );

    const response = await request(app)
      .get("/api/analytics/invalidAlias")
      .set("user-agent", "TestAgent")
      .set("Cookie", "token=testToken");

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("error", "Invalid url");
  });

  it("should return error if unauthorized", async () => {
    (authMiddleware as jest.Mock).mockImplementation(
      (req: Request, res: Response, next: NextFunction) => {
        res.status(403).json({ error: "Invalid token, login again" });
      }
    );

    const response = await request(app)
      .get("/api/analytics/invalidAlias")
      .set("user-agent", "TestAgent")
      .set("Cookie", "token=invalidTestToken");

    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty("error", "Invalid token, login again");
  });
});

describe("GET /api/analytics/topic/:topic", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return analytics for a valid topic if user is authenticated", async () => {
    (authMiddleware as jest.Mock).mockImplementation(
      (req: Request, res: Response, next: NextFunction) => {
        req.user = {
          googleID: "testUserId",
          email: "test@example.com",
          name: "Test User",
        };
        next();
      }
    );
    (getAnalyticsFromTopic as jest.Mock).mockResolvedValue({
      totalClicks: 100,
      uniqueUsers: 50,
      clicksByDate: [{ date: "2025-02-07", clicks: 10 }],
      deviceType: [{ deviceName: "mobile", uniqueClicks: 20, uniqueUsers: 15 }],
      osType: [{ osName: "Android", uniqueClicks: 30, uniqueUsers: 25 }],
    });

    const response = await request(app)
      .get("/api/analytics/topic/validTopic")
      .set("user-agent", "TestAgent")
      .set("Cookie", "token=testToken");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      totalClicks: 100,
      uniqueUsers: 50,
      clicksByDate: [{ date: "2025-02-07", clicks: 10 }],
      deviceType: [{ deviceName: "mobile", uniqueClicks: 20, uniqueUsers: 15 }],
      osType: [{ osName: "Android", uniqueClicks: 30, uniqueUsers: 25 }],
    });
    expect(getAnalyticsFromTopic).toHaveBeenCalledWith("validTopic", "testUserId");
  });

  it("should return error if unauthorized", async () => {
    (authMiddleware as jest.Mock).mockImplementation(
      (req: Request, res: Response, next: NextFunction) => {
        res.status(403).json({ error: "Invalid token, login again" });
      }
    );

    const response = await request(app)
      .get("/api/analytics/topic/topic")
      .set("user-agent", "TestAgent")
      .set("Cookie", "token=invalidTestToken");

    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty("error", "Invalid token, login again");
  });

  it("should return error if invalid topic is passed", async () => {
    (authMiddleware as jest.Mock).mockImplementation(
      (req: Request, res: Response, next: NextFunction) => {
        req.user = {
          googleID: "testUserId",
          email: "test@example.com",
          name: "Test User",
        };
        next();
      }
    );
    (getAnalyticsFromTopic as jest.Mock).mockRejectedValueOnce(new Error("Invalid topic"));

    const response = await request(app)
      .get("/api/analytics/topic/validTopic")
      .set("user-agent", "TestAgent")
      .set("Cookie", "token=testToken");

    expect(response.status).toBe(500);
    // expect(response.body).toEqual({
    //   totalClicks: 100,
    //   uniqueUsers: 50,
    //   clicksByDate: [{ date: "2025-02-07", clicks: 10 }],
    //   deviceType: [{ deviceName: "mobile", uniqueClicks: 20, uniqueUsers: 15 }],
    //   osType: [{ osName: "Android", uniqueClicks: 30, uniqueUsers: 25 }],
    // });
    // expect(getAnalyticsFromTopic).toHaveBeenCalledWith("validTopic", "testUserId");
  });
});

describe("GET /api/analytics/overall", () => {
   beforeEach(() => {
     jest.clearAllMocks();
   });

   it("should return analytics data if user is authenticated", async () => {
     (getAllAnalytics as jest.Mock).mockResolvedValue({
       totalClicks: 100,
       uniqueUsers: 50,
       clicksByDate: [{ date: "2025-02-07", clicks: 10 }],
       deviceType: [{ deviceName: "mobile", uniqueClicks: 20, uniqueUsers: 15 }],
       osType: [{ osName: "Android", uniqueClicks: 30, uniqueUsers: 25 }],
     });
     (authMiddleware as jest.Mock).mockImplementation(
       (req: Request, res: Response, next: NextFunction) => {
         req.user = {
           googleID: "testUserId",
           email: "test@example.com",
           name: "Test User",
         };
         next();
       }
     );

     const response = await request(app)
       .get("/api/analytics/overall")
       .set("user-agent", "TestAgent")
       .set("Cookie", "token=testToken");

     expect(response.status).toBe(200);
     expect(response.body).toEqual({
       totalClicks: 100,
       uniqueUsers: 50,
       clicksByDate: [{ date: "2025-02-07", clicks: 10 }],
       deviceType: [{ deviceName: "mobile", uniqueClicks: 20, uniqueUsers: 15 }],
       osType: [{ osName: "Android", uniqueClicks: 30, uniqueUsers: 25 }],
     });
     expect(getAllAnalytics).toHaveBeenCalledWith("testUserId");
   });

   it("should return error if unauthorized", async () => {
     (authMiddleware as jest.Mock).mockImplementation(
       (req: Request, res: Response, next: NextFunction) => {
         res.status(403).json({ error: "Invalid token, login again" });
       }
     );

     const response = await request(app)
       .get("/api/analytics/overall")
       .set("user-agent", "TestAgent")
       .set("Cookie", "token=invalidTestToken");

     expect(response.status).toBe(403);
     expect(response.body).toHaveProperty("error", "Invalid token, login again");
   });
})
