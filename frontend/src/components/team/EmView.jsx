import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { X, Trash } from "lucide-react";

const EmViewTeam = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [team, setTeam] = useState(null);

  // Fetch team data
  const fetchTeam = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/team/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.data.success) {
        setTeam(response.data.team);
      }
    } catch (error) {
      console.error("Failed to fetch team:", error);
    }
  }, [id]);

  useEffect(() => {
    fetchTeam();
  }, [fetchTeam]);

  // Get image URL
  const getImageUrl = (path) => {
    if (!path) return "https://www.gravatar.com/avatar/?d=mp&f=y";
    const cleaned = path.replace("public\\", "").replace(/\\/g, "/");
    return `http://localhost:3000/${cleaned}`;
  };

  // Delete handler
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this team?")) return;

    try {
      await axios.delete(`http://localhost:3000/api/team/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      navigate("/teams");
    } catch (err) {
      alert("Failed to delete team.");
    }
  };

  if (!team) return null;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-gray-600 hover:text-gray-800 flex items-center"
      >
        <X size={24} /> <span className="ml-2">Back</span>
      </button>

      <h2 className="text-3xl font-bold text-center mb-6">{team.team_name}</h2>

      {/* Leader Section */}
      <div className="border p-6 rounded mb-6 flex items-center gap-6">
        <img
          src={getImageUrl(team.team_leader?.profileImage)}
          alt="Leader"
          className="w-24 h-24 rounded-full object-cover border"
        />
        <div>
          <h3 className="text-lg font-medium">
            {team.team_leader?.name || "N/A"}
          </h3>
          <p className="text-sm text-gray-600">
            ID: {team.team_leader?._id || "N/A"}
          </p>
        </div>
      </div>

      <hr className="my-6 border-gray-300" />

      {/* Members Section */}
      <div className="border p-6 rounded">
        <h3 className="text-xl font-semibold text-center mb-6">Team Members</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {team.team_members?.map((member) => (
            <div key={member._id} className="flex flex-col items-center">
              <img
                src={getImageUrl(member.profileImage)}
                alt={member.name}
                className="w-16 h-16 rounded-full object-cover border mb-2"
              />
              <span className="text-sm font-medium text-center">
                {member.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmViewTeam;
