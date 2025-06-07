import express from "express";
import getCertificate from "../controllers/trainingController.js";

const router = express.Router();

router.get("/generate/:id", getCertificate);

export default router;
