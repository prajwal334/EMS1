import express from "express";
import { getOfferLetter } from "../controllers/offerLetterController.js";

const router = express.Router();

router.get("/generate/:id", getOfferLetter);

export default router;
