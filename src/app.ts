import express from "express";
import { AppDataSource } from "./config/data-source";
import swaggerUI from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import { version, description } from "../package.json";
import authRouter from "./routes/authRouter";
import cookieParser from "cookie-parser";
import cors from "cors";
import shortenRouter from "./routes/shortenRouter";
import analyticsRouter from "./routes/analyticsRouter";
import { authMiddleware } from "./middlewares/auth";
import redisClient from "./config/redis";
import fs from "fs";
import path from "path";
import "dotenv/config";

export const app = express();

const swaggerDocument = JSON.parse(fs.readFileSync(path.resolve("./swagger.json"), "utf-8"));


AppDataSource.initialize()
  .then(async (conn) => {
    console.log("connected to database");

    conn.runMigrations();
    app.listen(3000, () => {
      console.log("Server started on port 3000");
    });
  })
  .catch((err) => console.log("failed to connect to database ", err));

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.use("/auth", authRouter);
app.use("/api/shorten", shortenRouter);
app.use("/api/analytics", authMiddleware, analyticsRouter);

app.get("/", (req, res) => {
  const { token } = req.cookies;
  if (token) res.send("You are logged in, please visit /api/docs endpoint to see the documentation").end()
  else res.send('You are not logged in yet, please visit').redirect('/auth/google/login')
});