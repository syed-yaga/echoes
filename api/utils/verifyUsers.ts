import { errorHandler } from "./error.js";
import jwt from "jsonwebtoken";

export function verifyToken(req: any, res: any, next: any) {
  const token = req.cookies.access_token;
  if (!token) {
    return next(errorHandler(401, "Unauthorized", 1001));
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err: any, user: any) => {
    if (err) {
      return next(errorHandler(401, "Unauthorized", 1001));
    }
    req.user = user;
    next();
  });
}
