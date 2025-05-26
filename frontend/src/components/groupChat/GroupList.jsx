import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { FaPlusCircle, FaCog } from "react-icons/fa";

const GroupList = () => {
  const [groups, setGroups] = useState([]);
  const [activeGroupId, setActiveGroupId] = useState(null);
  const navigate = useNavigate();
  const { groupId } = useParams(); // optional if using route params

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
      console.error("Failed to load groups.");
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const getImageUrl = (path) => {
    if (!path) return "https://via.placeholder.com/80";
    const cleanedPath = path.replace("public\\", "").replace(/\\/g, "/");
    return `http://localhost:3000/${cleanedPath}`;
  };

  const handleSelectGroup = (id) => {
    setActiveGroupId(id);
    navigate(`/admin-dashboard/groups/${id}`);
  };

  return (
    <div className="flex flex-col h-screen bg-white border-r shadow-sm w-72">
      {/* Top Section */}
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-xl font-bold">Group Chats</h2>
        <button
          onClick={() => navigate("/admin-dashboard/chat/add")}
          title="Create Group"
        >
          <FaPlusCircle className="text-blue-600 text-xl" />
        </button>
      </div>

      {/* Group List */}
      <div className="flex-1 overflow-y-auto">
        {groups.map((group) => (
          <div
            key={group._id}
            onClick={() => handleSelectGroup(group._id)}
            className={`flex items-center px-4 py-2 cursor-pointer transition-all ${
              activeGroupId === group._id
                ? "bg-blue-100 shadow-inner"
                : "hover:bg-gray-100"
            }`}
          >
            <img
              src={getImageUrl(group.group_dp)}
              alt={group.group_name}
              className="w-12 h-12 rounded-full object-cover border border-gray-300"
            />
            <div className="ml-3">
              <p className="text-sm font-semibold text-gray-800">
                {group.group_name}
              </p>
              <p className="text-xs text-gray-500">
                Members: {group.members?.length || 0}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Icons */}
      <div className="flex items-center justify-between p-4 border-t bg-gray-50">
        <span className="text-sm text-gray-500">New Chat</span>
        <FaCog className="text-gray-400 cursor-pointer hover:text-blue-600" />
      </div>
    </div>
  );
};

export default GroupList;
