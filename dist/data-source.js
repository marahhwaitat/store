"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
var typeorm_1 = require("typeorm");
var dotenv = require("dotenv");
var path = require("path");
dotenv.config();
console.log(path.join(__dirname, "./entity"));
exports.AppDataSource = new typeorm_1.DataSource({
    type: "mysql",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: false,
    logging: true,
    entities: [path.join(__dirname, "./entity/*")],
    migrations: [path.join(__dirname, "./migrations/*")],
    subscribers: [],
});
