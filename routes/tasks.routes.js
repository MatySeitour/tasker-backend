import { Router } from "express";
import { getTasks, getTask, createTask, deleteTask, updateTask } from "../controllers/tasks.controllers.js";
import passport from "passport";


const router = Router();

router.use(passport.authenticate("jwt", { session: false }));

router.get("/", passport.authenticate("jwt", { session: false }), getTasks)

router.get("/:id", passport.authenticate("jwt", { session: false }), getTask)

router.post("/", passport.authenticate("jwt", { session: false }), createTask);

router.put("/:id", passport.authenticate("jwt", { session: false }), updateTask)

router.delete("/:id", passport.authenticate("jwt", { session: false }), deleteTask)

export default router;  