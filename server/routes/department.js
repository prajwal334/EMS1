import express from "express";
import authMiddleware from "../middleware/authMiddlware.js";
import {
  addDepartment,
  getDepartments,
  deleteDepartment,
  getDepartmentsWithEmployeeCount
} from "../controllers/departmentControl.js";

const router = express.Router();

router.get("/", authMiddleware, getDepartments);
router.post("/add", authMiddleware, addDepartment);
router.delete("/:id", authMiddleware, deleteDepartment);
router.get("/with-count", authMiddleware, getDepartmentsWithEmployeeCount);

export default router;
