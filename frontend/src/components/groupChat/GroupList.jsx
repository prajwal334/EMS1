import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { FaCog, FaBell, FaComments } from "react-icons/fa";
import logo1 from "../../assets/images/logo1.png";

const GroupList = () => {
  const [groups, setGroups] = useState([]);
  const [directChats, setDirectChats] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

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

  const fetchDirectChats = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/direct-chats", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (res.data.success) setDirectChats(res.data.chats || []);
    } catch (err) {
      console.error("Failed to load direct chats");
    }
  };

  useEffect(() => {
    fetchGroups();
    fetchDirectChats();
  }, []);

  const getImageUrl = (path) => {
  if (!path || typeof path !== "string") {
    // Use a local fallback image stored in public/images/
    return "http://localhost:3000/uploads/default-user.png";
  }

  const cleanedPath = path.replace(/^public[\\/]/, "").replace(/\\/g, "/");
  return `http://localhost:3000/${cleanedPath}`;
};


  const isGroupActive = (groupId) =>
    location.pathname === `/admin-dashboard/groups/${groupId}`;

  const isDirectActive = (chatId) =>
    location.pathname === `/admin-dashboard/groups/direct/${chatId}`;

  return (
    <div className="flex flex-col h-screen w-72 bg-white border-r shadow-md relative">
      {/* Banner & Profile Section */}
      <div
        className="relative w-full h-36 bg-cover bg-center"
        style={{ backgroundImage: `url(${logo1})` }}
      >
        <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-8 w-20 h-20 border-4 border-white rounded-full overflow-hidden shadow-lg bg-white">
          <img
            src={logo1}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Scrollable chat list */}
      <div className="mt-12 px-2 overflow-y-auto flex-1">
        {/* Group Chats */}
        <div className="mt-2">
          {groups.map((group) => (
            <div
              key={group._id}
              onClick={() => navigate(`/admin-dashboard/groups/${group._id}`)}
              className={`flex items-center justify-between px-4 py-2 cursor-pointer rounded-full transition-all mb-1 ${
                isGroupActive(group._id)
                  ? "bg-blue-100 shadow-inner"
                  : "hover:bg-gray-100"
              }`}
            >
              <div className="text-sm font-medium text-gray-800 truncate">
                {group.group_name}
              </div>
              <img
                src={getImageUrl(group.group_dp)}
                alt={group.group_name}
                className="w-10 h-10 rounded-full object-cover border border-gray-300"
              />
            </div>
          ))}
        </div>

        {/* Direct Chats */}
        <div className="mt-4 border-t pt-2">
          <p className="text-xs text-gray-500 pl-4 mb-1">Chats</p>
          {directChats.map((chat) => {
            const name =
              chat.recipient?.name ||
              chat.recipient?.userId?.name || // fallback if nested
              "Unnamed";

            const avatarPath =
              chat.recipient?.avatar || chat.recipient?.userId?.avatar;

            return (
              <div
                key={chat._id}
                onClick={() =>
                  navigate(`/admin-dashboard/groups/direct/${chat._id}`)
                }
                className={`flex items-center justify-between px-4 py-2 cursor-pointer rounded-full transition-all mb-1 ${
                  isDirectActive(chat._id)
                    ? "bg-blue-100 shadow-inner"
                    : "hover:bg-gray-100"
                }`}
              >
                <div className="text-sm font-medium text-gray-800 truncate">
                  {name}
                </div>
                <img
                  src={getImageUrl(avatarPath)}
                  alt={name}
                  className="w-10 h-10 rounded-full object-cover border border-gray-300"
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="flex items-center justify-between px-4 py-3 border-t bg-white">
        <div className="flex gap-4 items-center">
          <button
            onClick={() => navigate("/admin-dashboard/groups/chat/add")}
            className={`text-gray-500 hover:text-blue-600 ${
              location.pathname.includes("/groups/chat/add")
                ? "text-blue-600"
                : ""
            }`}
            title="Add Group"
          >
            <FaCog className="text-lg" />
          </button>
          <FaBell className="text-gray-500 text-lg cursor-pointer hover:text-blue-600" />
        </div>

        <button
          onClick={() => navigate("/admin-dashboard/groups/new-chat")}
          className={`bg-blue-100 hover:bg-blue-200 text-blue-600 p-2 rounded-full ${
            location.pathname.includes("/groups/new-chat")
              ? "ring-2 ring-blue-400"
              : ""
          }`}
          title="Start New Chat"
        >
          <FaComments className="text-xl" />
        </button>
      </div>
    </div>
  );
};

export default GroupList;
