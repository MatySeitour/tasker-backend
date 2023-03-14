import bcrypt from "bcrypt"
import boom from "@hapi/boom";
import { Strategy } from "passport-local";
import { pool } from "../../../db.js";


export const localStrategy = new Strategy(async (username, password, done) => {
    try {
        const user = await getNameUser(username);
        if (!user) {
            done(boom.unauthorized(), false);
        }
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            done(boom.unauthorized(), false);
        }
        done(null, {
            user: user.username,
            id: user.id,
        });
    }
    catch (error) {
        done(error, false)
    }
});

const getNameUser = async (username) => {
    try {
        const [result] = await pool.query(`SELECT * FROM users WHERE username="${username}"`);
        return result[0];
    }
    catch (error) {
        console.error(error)
    }
}