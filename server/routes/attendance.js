import express from "express";
import {
  saveAttendance,
  viewAttendance,
  editAttendanceTime,
  viewAttendanceByUserId,
  updateAttendanceByDate,
  getAttendanceStatsByUserId,
} from "../controllers/attendanceController.js";

const router = express.Router();

router.post("/save", saveAttendance);
router.get("/", viewAttendance);
router.get("/:userId", viewAttendanceByUserId);
router.put("/edit/:userId", editAttendanceTime);
router.put("/update/:userId", updateAttendanceByDate);
router.get('/stats/:userId', getAttendanceStatsByUserId);


export default router;
