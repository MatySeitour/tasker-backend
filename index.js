import express from "express"
import cors from "cors"
import { config } from "./config.js"
import tasksRoutes from "./routes/tasks.routes.js"
import authRoutes from "./routes/auth.routes.js"
import "./utils/auth/index.js"
import cookieParser from "cookie-parser";


const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/api/tasks", tasksRoutes);
app.use("/api/auth", authRoutes);

console.log(config.PORT);

app.listen(config.PORT)
console.log("server is running")