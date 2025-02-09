import "reflect-metadata";
import { DataSource } from "typeorm";
import { envVariables } from "../utils/envVariables";
import { Url } from "../entities/url.entity";
import { User } from "../entities/user.entity";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: envVariables.SQL_USERNAME,
  password: envVariables.SQL_PASSWORD,
  database: envVariables.SQL_DATABASE,
  synchronize: true,
  logging: false,
  entities: [__dirname + "/../entities/*.entity.{js,ts}"],
  migrations: ["src/migrations/*.ts"],
  subscribers: [],
});
