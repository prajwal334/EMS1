// routes/groupMessage.js
import express from "express";
import multer from "multer";
import path from "path";
import authMiddleware from "../middleware/authMiddlware.js";
import {
  addGroupMessage,
  getGroupMessages,
  updateGroupMessage,
  deleteGroupMessage,
  reactToMessage,
  forwardMessage,
} from "../controllers/groupMessageController.js";

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/messages");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  },
});
const upload = multer({ storage });

// Send new message (text + optional file)
router.post("/", authMiddleware, upload.single("file"), addGroupMessage);

// Get all messages in a group
router.get("/:groupId", authMiddleware, getGroupMessages);

// Update message (edit)
router.put("/:id", authMiddleware, updateGroupMessage);

// Delete message
router.delete("/:id", authMiddleware, deleteGroupMessage);

// Upload file route
router.post("/upload", authMiddleware, upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: "No file uploaded" });
  }
  res.status(200).json({
    success: true,
    url: `/uploads/messages/${req.file.filename}`,
  });
});

// ✅ FIXED: React to a specific message by ID
router.post("/:id", authMiddleware, reactToMessage);

// Forward message to another group
router.post("/forward", authMiddleware, forwardMessage);

export default router;
