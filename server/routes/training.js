import express from "express";
import getCertificate from "../controllers/trainingController.js";

const router = express.Router();

router.options("/generate/:id", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.sendStatus(200);
});

// Certificate download route
router.get("/generate/:id", getCertificate);

export default router;
