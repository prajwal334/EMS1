import express from "express";
import authMiddleware from "../middleware/authMiddlware.js";
import {
  addEmployee,
  upload,
  getEmployees,
  getEmployee,
  updateEmployee,
  fetchEmployeesByDepId,
} from "../controllers/employeeController.js";

const router = express.Router();

// Route to get all employees
router.get("/", authMiddleware, getEmployees);

// Route to add a new employee with image upload
router.post("/add", authMiddleware, upload.single("image"), addEmployee);

// Route to get a specific employee by ID
router.get("/:id", authMiddleware, getEmployee);

// Route to update employee details by ID
router.put("/:id", authMiddleware, updateEmployee);

// Route to get employees by department ID
router.get("/department/:id", authMiddleware, fetchEmployeesByDepId);

export default router;
