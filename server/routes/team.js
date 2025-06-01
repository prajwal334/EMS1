import express from "express";
import {
  upload,
  createTeam,
  deleteTeam,
  getAllTeams,
  getTeamById,
  getTeamsByUserId,
  getTeamsByDesignation,
} from "../controllers/teamControler.js";

const router = express.Router();

router.post("/add", upload.single("team_dp"), createTeam);
router.get("/", getAllTeams);
router.delete("/:id", deleteTeam);
router.get("/:id", getTeamById);
router.get("/user/:userId", getTeamsByUserId);
router.get("/by-designation/:designation", getTeamsByDesignation);

export default router;
