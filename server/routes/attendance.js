import express from "express";
import {
  getAttendance,
  addOrUpdateAttendance,
} from "../controllers/attendanceController.js";

const router = express.Router();

router.get("/", getAttendance);
router.post("/add", addOrUpdateAttendance);

export default router;
