import mongoose from "mongoose";

const teamSchema = new mongoose.Schema({
    teamname_id: { type: String, required: true },
    description: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Team = mongoose.model("Team", teamSchema);
export default Team;   
