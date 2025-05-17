import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/authContext";
import { FaBell } from "react-icons/fa";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [time, setTime] = useState(
    new Date().toLocaleTimeString("en-GB", { hour12: false })
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString("en-GB", { hour12: false }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:3000/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="flex items-center justify-between h-12 bg-blue-700 text-white px-5">
      <p>Welcome {user.name}</p>
      <div className="flex items-center space-x-4">
        <p className="text-sm">{time}</p>
        <FaBell className="text-white" />
        <button
          className="px-4 py-1 bg-blue-600 hover:bg-blue-800 rounded"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
