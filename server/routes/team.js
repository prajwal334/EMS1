import express from "express";
import {
  upload,
  createTeam,
  deleteTeam,
  getAllTeams,
  getTeamById,
  getTeamsByUserId,
} from "../controllers/teamControler.js";

const router = express.Router();

router.post("/add", upload.single("team_dp"), createTeam);
router.get("/", getAllTeams);
router.delete("/:id", deleteTeam);
router.get("/:id", getTeamById);
router.get("/user/:userId", getTeamsByUserId);

export default router;
