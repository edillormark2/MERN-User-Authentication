import express from "express";
import {
  test,
  updateUser,
  deleteUser,
  getUserData
} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/user/:id", getUserData); // Reordered to be more specific
router.post("/update/:id", verifyToken, updateUser);
router.delete("/delete/:id", verifyToken, deleteUser);
router.get("/", test);

export default router;
