import express from "express";
import { login, logout, verify } from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddlware.js";

const router = express.Router();

router.post("/login", login);
router.post("/logout", authMiddleware, logout);
router.get("/verify", authMiddleware, verify);

export default router;
