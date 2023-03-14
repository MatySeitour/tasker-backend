import { Router } from "express";
import jwt from "jsonwebtoken";
import passport from "passport";
import cookieParser from "cookie-parser";
import { createUser, logOut, loginVerify, getUsers, recoveryPassword, passwordToChange, getEmailUser } from "../controllers/login.controller.js";
import { login } from "../controllers/login.controller.js";

const router = Router();

router.post("/register", createUser);

router.get("/users", getUsers);

router.post("/login", passport.authenticate("local", { session: false }), login);

router.get("/session", passport.authenticate("jwt", { session: false }), loginVerify);

router.post("/email", getEmailUser);

router.post("/recovery", recoveryPassword);

router.post("/new-password", passwordToChange);

router.get("/logout", logOut);


export default router;