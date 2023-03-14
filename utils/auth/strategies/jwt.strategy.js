import { Strategy, ExtractJwt } from "passport-jwt";
import { config } from "../../../config.js";

const options = {};
function cookieExtractor(req) {
    var token = null;
    if (req && req.cookies) token = req.cookies['session'];
    return token;
};

options.jwtFromRequest = cookieExtractor;
options.secretOrKey = config.jwtSecret;

const jwtStrategy = new Strategy(options, (payload, done) => {
    return done(null, payload);
})

export { jwtStrategy };