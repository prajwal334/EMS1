import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./team.css"; // reuse styles from team.css

const GroupList = () => {
  const [groups, setGroups] = useState([]);

  const fetchGroups = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/group", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res.data.success) {
        setGroups(res.data.groups || []);
      }
    } catch (error) {
      alert("Failed to load groups.");
    }
  };

  const getImageUrl = (path) => {
    if (!path) return "https://via.placeholder.com/100";
    const cleanedPath = path.replace("public\\", "").replace(/\\/g, "/");
    return `http://localhost:3000/${cleanedPath}`;
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  return (
    <div className="p-5">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold">Group Chat List</h3>
        <Link
          to="/admin-dashboard/chat/add"
          className="px-4 py-1 bg-blue-600 rounded hover:bg-blue-800 text-white shadow-lg"
        >
          Add Group
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {groups.map((group) => (
          <div key={group._id} className="flip-card h-48 w-full relative">
            <div className="flip-card-inner w-full h-full">
              {/* Front */}
              <div className="flip-card-front bg-white p-4 rounded-xl shadow text-center flex flex-col items-center justify-center">
                <img
                  src={getImageUrl(group.group_dp)}
                  alt={group.group_name}
                  className="w-24 h-24 rounded-full object-cover border border-gray-300"
                />
                <div className="text-sm font-medium text-gray-800 mt-2">
                  {group.group_name}
                </div>
              </div>

              {/* Back */}
              <div className="flip-card-back bg-blue-800 text-white rounded-xl shadow flex flex-col items-center justify-center p-4 text-sm">
                <div className="bg-yellow-400 text-blue-900 font-bold px-3 py-1 rounded mb-2">
                  {group.group_name}
                </div>
                <div>Created by: {group.createdBy?.name || "Admin"}</div>
                <div className="text-xs mt-1">
                  Members: {group.members?.length || 0}
                </div>
                <br />
                <Link
                  to={`/admin-dashboard/groups/${group._id}`}
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
  );
};

export default GroupList;
