import express from "express";
import authMiddleware from "../middleware/authMiddlware.js";
import {
  addDepartment,
  getDepartments,
  deleteDepartment,
  getDepartmentsWithEmployeeCount,
  getSubDepartments,
  getDepartmentById,
} from "../controllers/departmentControl.js";

const router = express.Router();

router.get("/", getDepartments);
router.get("/:id", getDepartmentById);
router.get("/:id/subdepartments", getSubDepartments);
router.post("/add", authMiddleware, addDepartment);
router.delete("/:id", authMiddleware, deleteDepartment);
router.get("/with-count", authMiddleware, getDepartmentsWithEmployeeCount);

export default router;
