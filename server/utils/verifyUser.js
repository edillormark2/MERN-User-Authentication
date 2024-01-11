// utils/verifyUser.js

import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";
import dotenv from "dotenv";
dotenv.config();

// utils/verifyUser.js

export const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    console.log("Received Token:", token); // Log the received token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodedToken;
    console.log("Decoded Token:", decodedToken);
    next();
  } catch (error) {
    console.error("Token Verification Error:", error);
    res.status(401).json({ error: "Authentication Failed!" });
  }
};
