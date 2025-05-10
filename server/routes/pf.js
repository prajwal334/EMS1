import express from "express";
import { updatePf, getPfByEmployeeId } from "../controllers/pfController.js";

const router = express.Router();

router.post("/pf", updatePf);
router.get("/pf/:employeeId", getPfByEmployeeId);

export default router;
