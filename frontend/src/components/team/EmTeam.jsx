import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/authContext";
import { Link } from "react-router-dom";
import "./team.css";

const getCleanImageUrl = (team_dp) => {
  if (!team_dp) return "https://via.placeholder.com/100";
  const cleanedPath = team_dp.replace("public\\", "").replace(/\\/g, "/");
  return `http://localhost:3000/${cleanedPath}`;
};

const MyTeams = () => {
  const { user } = useAuth();
  const userId = user?._id;

  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyTeams = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/team/user/${userId}`);
      const data = await res.json();
      setTeams(data.teams || []);
    } catch (err) {
      console.error("Failed to fetch teams", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchMyTeams();
    }
  }, [userId]);

  const groupTeamsByDepartment = (teams) => {
    const grouped = {};
    teams.forEach((team) => {
      const depName = team.departmentId?.dep_name || "Unknown Department";
      if (!grouped[depName]) grouped[depName] = [];
      grouped[depName].push(team);
    });
    return grouped;
  };

  const groupedTeams = groupTeamsByDepartment(teams);

  if (!userId) return <div>Please log in to view your teams.</div>;
  if (loading) return <div>Loading your teams...</div>;

  return (
    <div className="p-4 space-y-10">
      <h2 className="text-2xl font-bold mb-6">My Teams</h2>
      {Object.entries(groupedTeams).map(([department, teams]) => (
        <div key={department}>
          <h4 className="text-xl font-semibold mb-3 text-gray-700">
            {department}
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {teams.map((team) => (
              <div key={team._id} className="flip-card w-full h-48 relative">
                <div className="flip-card-inner w-full h-full">
                  {/* Front Side */}
                  <div className="flip-card-front bg-white p-4 rounded-xl shadow text-center flex flex-col items-center justify-center relative">
                    <img
                      src={getCleanImageUrl(team.team_dp)}
                      alt={team.team_name}
                      className="w-24 h-24 rounded-full object-cover border border-gray-300"
                    />
                    <div className="text-sm font-medium text-gray-800 mt-2">
                      {team.team_name}
                    </div>
                  </div>

                  {/* Back Side */}
                  <div className="flip-card-back bg-blue-800 text-white rounded-xl shadow flex flex-col items-center justify-center p-4 text-sm">
                    <div className="bg-yellow-400 text-blue-900 font-bold px-3 py-1 rounded mb-2">
                      {team.team_name}
                    </div>
                    <div className="mb-2">
                      Leader - {team.leaderUserId?.name || "No Leader"}
                    </div>
                    <Link
                      to={`/employee-dashboard/teams/team/${team._id}`}
                      className="px-3 py-1 bg-white text-blue-800 font-semibold rounded hover:bg-gray-200 transition"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyTeams;
