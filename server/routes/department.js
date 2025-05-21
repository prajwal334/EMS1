import express from "express";
import authMiddleware from "../middleware/authMiddlware.js";
import {
  addDepartment,
  getDepartments,
  deleteDepartment,
} from "../controllers/departmentControl.js";

const router = express.Router();

router.get("/", authMiddleware, getDepartments);
router.post("/add", authMiddleware, addDepartment);
router.delete("/:id", authMiddleware, deleteDepartment);

export default router;
