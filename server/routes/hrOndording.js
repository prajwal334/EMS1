import express from "express";
import { getAllCandidates, addCandidate, updateCandidateStatus } from "../controllers/hrOnboarding.js";

const router = express.Router();

router.get("/", getAllCandidates);
router.post("/add", addCandidate);
router.patch("/:id", updateCandidateStatus);

export default router;
