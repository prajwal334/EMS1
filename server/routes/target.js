import express from "express";
import { addTarget, getAllTargets } from "../controllers/targetController.js";

const router = express.Router();

// POST /api/targets
router.post("/", addTarget);

// GET /api/targets
router.get("/", getAllTargets);

export default router;
