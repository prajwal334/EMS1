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
<<<<<<< Updated upstream
    const {
      team_name,
      departmentId,
      designation,
      leaderUserId,
      memberUserIds,
    } = req.body;
=======
    const { team_name, departmentId, leaderUserId, memberUserIds } = req.body;
>>>>>>> Stashed changes

    const team_dp = req.file?.path || null;

    const newTeam = new Team({
      team_name,
      team_dp,
      departmentId,
<<<<<<< Updated upstream
      designation,
=======
>>>>>>> Stashed changes
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
      .populate("memberUserIds", "name");

    const formatted = teams.map((team) => ({
      _id: team._id,
      team_name: team.team_name,
      team_dp: team.team_dp,
      department: team.departmentId,
<<<<<<< Updated upstream
      designation: team.designation,
=======
>>>>>>> Stashed changes
      leaderUserId: team.leaderUserId,
      memberUserIds: team.memberUserIds,
    }));

    res.status(200).json({ success: true, teams: formatted });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch teams",
      details: error.message,
    });
  }
};

// Get a team by ID
const getTeamById = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id)
      .populate("departmentId", "dep_name")
      .populate("leaderUserId", "name")
      .populate("memberUserIds", "name");

    if (!team) {
      return res.status(404).json({ success: false, error: "Team not found" });
    }

    res.status(200).json({
      success: true,
      team: {
        _id: team._id,
        team_name: team.team_name,
        team_dp: team.team_dp,
        department: team.departmentId,
<<<<<<< Updated upstream
        designation: team.designation,
=======
>>>>>>> Stashed changes
        leaderUserId: team.leaderUserId,
        memberUserIds: team.memberUserIds,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch team",
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

<<<<<<< Updated upstream
// Get teams by user ID
const getTeamsByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    const teams = await Team.find({
      memberUserIds: userId,
    })
      .populate("departmentId", "dep_name")
      .populate("leaderUserId", "name")
      .populate("memberUserIds", "name");

    const formatted = teams.map((team) => ({
      _id: team._id,
      team_name: team.team_name,
      team_dp: team.team_dp,
      department: team.departmentId,
      designation: team.designation,
      leaderUserId: team.leaderUserId,
      memberUserIds: team.memberUserIds,
    }));

    res.status(200).json({ success: true, teams: formatted });
  } catch (error) {
    console.error("Error fetching teams for user:", error);
    res.status(500).json({ error: "Failed to fetch teams" });
  }
};

//getTeamsByDesignation
const getTeamsByDesignation = async (req, res) => {
  const { designation } = req.params;
  try {
    const teams = await Team.find({ designation: designation })
      .populate("leaderUserId", "name")
      .populate("memberUserIds", "name");

    res.json({ teams });
  } catch (error) {
    console.error("Error fetching teams by designation:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export {
  upload,
  createTeam,
  getAllTeams,
  deleteTeam,
  getTeamById,
  getTeamsByUserId,
  getTeamsByDesignation,
};
=======
export { upload, createTeam, getAllTeams, deleteTeam, getTeamById };
>>>>>>> Stashed changes
