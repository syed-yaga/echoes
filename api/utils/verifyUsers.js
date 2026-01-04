import { errorHandler } from "./error.js";
import jwt from "jsonwebtoken";
export function verifyToken(req, res, next) {
    const token = req.cookies.access_token;
    if (!token) {
        return next(errorHandler(401, "Unauthorized", 1001));
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return next(errorHandler(401, "Unauthorized", 1001));
        }
        req.user = user;
        next();
    });
}
//# sourceMappingURL=verifyUsers.js.map