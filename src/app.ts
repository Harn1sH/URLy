import express from "express";
import { AppDataSource } from "./config/data-source";
import swaggerUI from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import { version, description } from "../package.json";

const app = express();
const swaggerOption: swaggerJsdoc.Options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "URLy API Documentation",
      version,
      description,
    },
  },
  apis: ["./src/routes/*.ts"],
};

const swaggerDocs = swaggerJsdoc(swaggerOption);

AppDataSource.initialize()
  .then(async (conn) => {
    console.log("connected to database");

    conn.runMigrations();
    app.listen(3000, () => {
      console.log("Server started on port 3000");
    });
  })
  .catch((err) => console.log("failed to connect to database ", err));

app.use("/api/docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));
