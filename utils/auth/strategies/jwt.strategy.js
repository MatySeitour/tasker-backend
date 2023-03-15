import { Strategy, ExtractJwt } from "passport-jwt";
import { config } from "../../../config.js";

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.jwtSecret
};
// function cookieExtractor(req) {
//     var token = null;
//     if (req && req.cookies) token = req.cookies['session'];
//     return token;
// };

// options.jwtFromRequest = cookieExtractor;

const jwtStrategy = new Strategy(options, (payload, done) => {
    console.log("entra en jwt")
    return done(null, payload);
})

export { jwtStrategy };