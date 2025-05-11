import express from "express";
import authMiddleware from "../middleware/authMiddlware.js";
import { addSalary, getSalary } from "../controllers/salaryController.js";

const router = express.Router();

// Route to add salary details
router.post("/add", authMiddleware, addSalary);

// Route to get salary details by employee ID
router.get("/:id", authMiddleware, getSalary);

// router.get("/download/:id", downloadSalarySlip);

export default router;
