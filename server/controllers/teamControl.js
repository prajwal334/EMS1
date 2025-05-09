import Team from "../models/Team.js";

const getTeams = async (req, res) => {
    try {
        const teams = await Team.find();
        return res.status(200).json({ success: true, teams });
    } catch (error) {
        return res.status(500).json({ success: false, error: "Server Error" });
    }
}

const addTeam = async (req,res) => {
    try {
         console.log("Request body:", req.body);
        const {teamname_id, description } = req.body;
        const newteamname = new Team({
            teamname_id,
            description
        });
        await newteamname.save();
        return res.status(201).json({ success: true, message: "Team Added Successfully", Team: newteamname });
    } catch (error) {
        console.error("Add Team Error:", error);
        return res.status(500).json({ success: false, error: "Server Error" });
    }
}

export { addTeam, getTeams }