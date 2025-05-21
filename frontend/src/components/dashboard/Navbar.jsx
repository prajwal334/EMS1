
import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/authContext";
import { FaUserShield, FaBell, FaSignOutAlt } from "react-icons/fa";


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

  // Determine dashboard label based on user role
  const dashboardTitle =
    user?.role === "admin"
      ? "Admin Dashboard"
      : user?.role === "employee"
      ? "Employee Dashboard"
      : "Dashboard";

  return (
    <header className="flex items-center justify-between bg-blue-800 text-white px-6 py-3 shadow-md">
      {/* Left Side: Title */}
      <div className="flex items-center space-x-3">
        <FaUserShield className="text-2xl" />
        <h1 className="text-xl font-bold tracking-wide">Admin Dashboard</h1>
      </div>

      {/* Right Side: Time, Notification, Welcome, Logout */}
      <div className="flex items-center space-x-4">
        {/* Clock */}
        <p className="text-sm font-mono">{time}</p>

        {/* Notification Icon */}
        <FaBell className="text-lg" />

        {/* Welcome & Initial */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-semibold">
            {user?.name?.charAt(0).toUpperCase() || "A"}
          </div>
          <p className="text-sm">

            Welcome, <span className="font-medium">{user?.name || "User"}</span>

          </p>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded text-sm font-medium"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
