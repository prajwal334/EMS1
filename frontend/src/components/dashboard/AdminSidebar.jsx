import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaBuilding,
  FaCalendarCheck,
  FaCogs,
  FaMoneyBillWave,
  FaTachometerAlt,
  FaUser,
  FaClock,
  FaUserShield,
  FaUsers,
} from "react-icons/fa";

const AdminSidebar = () => {
  const navItems = [
    {
      to: "/admin-dashboard",
      icon: <FaTachometerAlt />,
      label: "Dashboard",
      exact: true,
    },
    { to: "/admin-dashboard/employees", icon: <FaUsers />, label: "Employees" },
    {
      to: "/admin-dashboard/departments",
      icon: <FaBuilding />,
      label: "Departments",
    },
    { to: "/admin-dashboard/teams", icon: <FaUser />, label: "Teams" },
    {
      to: "/admin-dashboard/leaves",
      icon: <FaCalendarCheck />,
      label: "Leaves",
    },
    {
      to: "/admin-dashboard/salary/add",
      icon: <FaMoneyBillWave />,
      label: "Salary",
    },
    {
      to: "/admin-dashboard/attendance",
      icon: <FaClock />,
      label: "Attendance",
    },
    {
      to: "/admin-dashboard/holidays",
      icon: <FaCalendarCheck />,
      label: "Holidays",
    },
    {
      to: "/admin-dashboard/settings",
      icon: <FaCogs />,
      label: "Change Password",
    },
  ];

  return (
    <aside className="bg-white text-black h-screen fixed left-0 top-0 w-64 shadow-md flex flex-col">
      {/* Sidebar Header */}
      <div className="bg-blue-700 h-14 flex items-center justify-center shadow-sm">
        <h3 className="text-xl text-white font-bold flex items-center gap-2">
          <FaUserShield className="text-2xl" />
          Employee N-Dash
        </h3>
      </div>

      {/* Sidebar Links */}
      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
        {navItems.map(({ to, icon, label, exact }) => (
          <NavLink
            to={to}
            key={label}
            end={exact}
            className={({ isActive }) =>
              `${
                isActive ? "bg-blue-600 text-white" : "text-gray-700"
              } flex items-center gap-3 py-2 px-4 rounded hover:bg-blue-100 hover:text-blue-700 transition duration-200`
            }
          >
            <span className="text-lg">{icon}</span>
            <span className="text-sm font-medium">{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
