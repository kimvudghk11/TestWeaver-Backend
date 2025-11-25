const jwt = require("jsonwebtoken");
const config = require("../config/env");

function auth(req, res, next) {
    const authHeader = req.headers.authorization;

    const token = authHeader?.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : req.cookies?.access_token;

    // 2) 토큰 없으면 401
    if (!token) {
        const err = new Error("Unauthorized");
        err.status = 401;
        return next(err);
    }

    try {
        const payload = jwt.verify(token, config.jwt.secret);

        req.user = {
            id: payload.sub,
            loginId: payload.loginId,
        };

        return next();
    } catch (e) {
        const err = new Error("Invalid or expired token");
        err.status = 401;
        return next(err);
    }
}

module.exports = auth;
