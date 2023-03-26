import jwt from "jsonwebtoken";
import { config } from "../config.js";
import bcrypt from "bcrypt"
import nodemailer from "nodemailer"
import { pool } from "../db.js";
import boom from "@hapi/boom"


export const createUser = async (req, res) => {
    try {
        const { username, password, email } = req.body;
        if (username === "" || username.length < 3) {
            return res.status(409).json({
                message: "username must have at least 3 characters"
            })
        }
        else if (password === "" || password.length < 5) {
            return res.status(409).json({
                message: "password must have at least 5 characters"
            })
        }
        else if (email === "") {
            return res.status(409).json({
                message: "you need to write an email"
            })
        }
        const hash = await bcrypt.hash(password, 10);
        const [result] = await pool.query("INSERT INTO users(username, password, email) VALUES(?, ?, ?)", [username, hash, email]);
        return res.json(result);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const getUsers = async (req, res) => {
    try {
        const [result] = await pool.query("SELECT * FROM users");
        return res.json({
            username: result,
        });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}



export const login = async (req, res) => {
    try {
        const user = req.user;
        const payload = {
            id: user.id,
            username: user.user,
        }
        const token = jwt.sign(payload, config.jwtSecret);
        res.cookie("session", token);
        res.json({
            username: user.user,
        })
    }
    catch (error) {
        console.error(error)
    }
}

export const logOut = async (req, res, next) => {
    try {
        res.clearCookie("session");
        res.status(200).json({
            message: "log out"
        })
    }
    catch (error) {
        console.error(error)
        next(error);
    }
}

export const loginVerify = async (req, res, next) => {
    try {
        const user = req.user;
        const payload = {
            id: user.id,
            role: user.username,
        }
        const token = jwt.sign(payload, config.jwtSecret);
        res.json({
            user,
        })
    }
    catch (error) {
        next(error);
    }
}

export const recoveryPassword = async (req, res, next) => {
    try {
        const { email, username } = req.body;
        const rta = await recoverySendMail(email, username);
        res.json(rta);
    }
    catch (error) {
        console.error(error);
        next(error);
    }
}

export const recoverySendMail = async (email, username) => {
    const user = await getEmailUser(email, username);
    if (!user) {
        throw boom.unauthorized().output.payload;
    }
    const payload = { id: user.id };
    const token = jwt.sign(payload, config.jwtSecret, { expiresIn: "15min" });
    const link = `https://tasker-backend-production.up.railway.app/#/new-password?token=${token}`;
    console.log("mail mandado");
    console.log(user.email);
    const mail = {
        from: config.EMAIL_ADDRESS, // sender address
        to: user.email, // list of receivers
        subject: "email to recover password", // Subject line
        html: `<b>ingresa a este link => ${link}</b>`, // html body
    }
    const rta = await sendMail(mail);
    return rta;
}

async function sendMail(infoMail) {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: config.EMAIL_ADDRESS, // generated ethereal user
            pass: config.EMAIL_PASSWORD, // generated ethereal password
        },
    });

    await transporter.sendMail(infoMail);
    return { message: "mail sent", mail: infoMail }
}

export const getEmailUser = async (email, username) => {
    try {
        if (!email) {
            const [result] = await pool.query(`SELECT * FROM users WHERE username="${username}"`);
            return result[0];
        }
        else if (!username) {
            const [result] = await pool.query(`SELECT * FROM users WHERE email="${email}"`);
            return result[0];
        }
    }
    catch (error) {
        console.error(error)
    }

}
export const getIdUser = async (id) => {
    try {
        const [result] = await pool.query(`SELECT * FROM users WHERE id="${id}"`);
        return result[0];
    }
    catch (error) {
        console.error(error)
    }
}


export const passwordToChange = async (req, res, next) => {
    try {
        const { token, newPassword } = req.body;
        const payload = jwt.verify(token, config.jwtSecret);
        const user = await getIdUser(payload.id);
        const rta = await changePassword(user, newPassword);
        return res.json({
            rta
        })
    }
    catch (error) {
        console.error("entra aca", error);
        next(error);
    }
}

export const changePassword = async (user, newPassword) => {
    try {
        const hash = await bcrypt.hash(newPassword, 10);
        await pool.query(`UPDATE users SET password=? WHERE id=?`, [hash, user.id]);
        return { message: "password changed" };
    }
    catch (error) {
        throw boom.clientTimeout().output.payload.message;
    }
}