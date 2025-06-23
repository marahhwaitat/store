import "reflect-metadata";
import { DataSource } from "typeorm";
import * as dotenv from "dotenv";
import * as path from "path";
dotenv.config();
console.log(path.join(__dirname,"./entity"))
export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  logging: true,
  entities: [path.join(__dirname,"./entity/*")],
  migrations: [path.join(__dirname, "./migrations/*")],
  subscribers: [],
});
