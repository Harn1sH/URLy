import "reflect-metadata";
import { DataSource } from "typeorm";
import { Url } from "../entities/url.entity";
import { User } from "../entities/user.entity";
import "dotenv/config";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.HOST,
  port: Number.parseInt(process.env.SQL_PORT || '3307'),
  username: process.env.SQL_USERNAME,
  password: process.env.SQL_PASSWORD,
  database: process.env.SQL_DATABASE,
  synchronize: true,
  logging: false,
  entities: [__dirname + "/../entities/*.entity.{js,ts}"],
  migrations: ["src/migrations/*.ts"],
  subscribers: [],
});
