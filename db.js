import { createPool } from "mysql2/promise";
import { config } from "./config.js";

export const pool = createPool({
    host: config.DB_HOST,
    port: config.DB_PORT,
    user: config.DB_USER,
    password: config.DB_PASSWORD,
    database: config.DB_DATABASE,
})