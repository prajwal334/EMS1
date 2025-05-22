import React from "react";
import { useAuth } from "../../context/authContext.jsx";
import { FaUserShield, FaSignOutAlt } from "react-icons/fa";

const Navbar = () => {
  const { user, logout } = useAuth();

  // Determine dashboard label based on user role
  const dashboardTitle =
    user?.role === "admin"
      ? "Admin Dashboard"
      : user?.role === "employee"
      ? "Employee Dashboard"
      : "Dashboard";

  return (
    <header className="flex items-center justify-between bg-blue-800 text-white px-6 py-3 shadow-md">
      {/* Left Side: Icon & Title */}
      <div className="flex items-center space-x-3">
        <FaUserShield className="text-2xl text-white" />
        <h1 className="text-xl font-bold tracking-wide">{dashboardTitle}</h1>
      </div>

      {/* Right Side: Welcome & Logout */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-semibold">
            {user?.name?.charAt(0).toUpperCase() || "A"}
          </div>
          <p className="text-sm">
            Welcome, <span className="font-medium">{user?.name || "User"}</span>
          </p>
        </div>

        <button
          onClick={logout}
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
