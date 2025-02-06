import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../entities/User";
import { envVariables } from "../utils/envVariables";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: envVariables.SQL_USERNAME,
  password: envVariables.SQL_PASSWORD,
  database: envVariables.SQL_DATABASE,
  synchronize: true,
  logging: false,
  entities: [User],
  migrations: ['src/migrations/*.ts'],
  subscribers: [],
});
