// utils/verifyUser.js

import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";
import dotenv from "dotenv";
dotenv.config();

export const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the token is expired
    const isTokenExpired = new Date(decodedToken.exp * 1000) < new Date();

    if (isTokenExpired) {
      console.error("Token has expired");
      return res.redirect("/signin"); // Redirect to the sign-in page
    }

    req.user = decodedToken;
    next();
  } catch (error) {
    console.error("Token Verification Error:", error);
    res.status(401).json({ error: "Authentication Failed!" });
  }
};
