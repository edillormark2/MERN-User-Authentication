import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) {
    console.error("No token provided");
    return next(errorHandler(401, "You are not authenticated!"));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
    if (err) {
      console.error("Token verification error:", err);
      return next(errorHandler(403, "Token is not valid!"));
    }

    req.user = decodedToken;
    console.log("Decoded Token:", decodedToken);

    next();
  });
};
