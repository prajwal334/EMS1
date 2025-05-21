import express from "express";
import { getLoginHistoryByUserId } from "../controllers/loginHistoryController.js";
import authMiddleware from "../middleware/authMiddlware.js";

const router = express.Router();

// GET /api/login-history/:employeeId
router.get("/:userId", getLoginHistoryByUserId);

export default router;
