// src/pages/ChatLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import GroupList from "../components/groupChat/GroupList.jsx";

const ChatLayout = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-[300px] border-r shadow-sm">
        <GroupList />
      </div>

      {/* Chat Window */}
      <div className="flex-1 bg-gray-50">
        <Outlet />
      </div>
    </div>
  );
};

export default ChatLayout;
