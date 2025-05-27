import express from "express";
import multer from "multer";
import authMiddleware from "../middleware/authMiddlware.js";
import {
  sendDirectMessage,
  getDirectMessages,
} from "../controllers/directMessageController.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "public/uploads/messages"),
  filename: (req, file, cb) => cb(null, Date.now() + "_" + file.originalname),
});
const upload = multer({ storage });

router.post("/", authMiddleware, upload.single("file"), sendDirectMessage);
router.get("/:chatId", authMiddleware, getDirectMessages);

export default router;
