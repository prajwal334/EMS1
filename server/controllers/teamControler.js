import Team from "../models/Team.js";
import multer from "multer";
import path from "path";

// Multer storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
});

// Create a new team
const createTeam = async (req, res) => {
  try {
    const { team_name, departmentId, leaderUserId, memberUserIds } = req.body;

    const team_dp = req.file?.path || null;

    const newTeam = new Team({
      team_name,
      team_dp,
      departmentId,
      leaderUserId,
      memberUserIds,
    });

    const savedTeam = await newTeam.save();
    res.status(201).json(savedTeam);
  } catch (error) {
    console.error("❌ Error creating team:", error);
    res
      .status(500)
      .json({ error: "Failed to create team", details: error.message });
  }
};

// Get all teams
const getAllTeams = async (req, res) => {
  try {
    const teams = await Team.find()
      .populate("departmentId", "dep_name")
      .populate("leaderUserId", "name")
      .select("team_name team_dp departmentId leaderUserId");

    const formattedTeams = teams.map((team) => ({
      _id: team._id,
      team_name: team.team_name,
      team_dp: team.team_dp,
      department: team.departmentId,
      team_leader: team.leaderUserId,
    }));

    res.status(200).json({ success: true, teams: formattedTeams });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch teams",
      details: error.message,
    });
  }
};

// Delete a team by ID
const deleteTeam = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedTeam = await Team.findByIdAndDelete(id);

    if (!deletedTeam) {
      return res.status(404).json({ error: "Team not found" });
    }

    res.status(200).json({ message: "Team deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to delete team", details: error.message });
  }
};

// Get a team by ID
const getTeamById = async (req, res) => {
  try {
    const { id } = req.params;

    const team = await Team.findById(id)
      .populate("departmentId", "dep_name")
      .populate("leaderUserId", "name")
      .populate("memberUserIds", "name email")
      .select("team_name team_dp departmentId leaderUserId memberUserIds");

    if (!team) {
      return res.status(404).json({ success: false, error: "Team not found" });
    }

    const formattedTeam = {
      _id: team._id,
      team_name: team.team_name,
      team_dp: team.team_dp,
      department: team.departmentId,
      team_leader: team.leaderUserId,
      team_members: team.memberUserIds,
    };

    res.status(200).json({ success: true, team: formattedTeam });
  } catch (error) {
    console.error("❌ Error fetching team by ID:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch team",
      details: error.message,
    });
  }
};

const getTeamsByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    const teams = await Team.find({
      memberUserIds: userId, // Mongoose can match ObjectId as string
    }).populate("departmentId leaderUserId memberUserIds");

    res.json({ teams });
  } catch (error) {
    console.error("Error fetching teams for user:", error);
    res.status(500).json({ error: "Failed to fetch teams" });
  }
};

export {
  upload,
  createTeam,
  getAllTeams,
  deleteTeam,
  getTeamById,
  getTeamsByUserId,
};
