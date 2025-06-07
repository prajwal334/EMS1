import express from "express";
import {
  upload,
  createTask,
  getAllTasks,
  updateTask,
  deleteTask,
  getTaskByEmployeeName,
} from "../controllers/taskController.js";
import verifyUser from "../middleware/authMiddlware.js";

const router = express.Router();

// Create a task
router.post("/assign", verifyUser, upload.single("initial_image"), createTask);

// Get all tasks
router.get("/", getAllTasks);

// Update a task
router.put("/:id", upload.single("update_image"), updateTask);

// Delete a task
router.delete("/:id", deleteTask);

router.get("/employee/:employeeName", getTaskByEmployeeName);

export default router;
