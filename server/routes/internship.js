// routes/internshipCertificate.js
import express from "express";
import getInternshipCertificate from "../controllers/internshipController.js";

const router = express.Router();

router.get("/generate/:id", getInternshipCertificate);

export default router;
