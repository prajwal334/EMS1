import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaBuilding,
  FaCalendarAlt,
  FaCogs,
  FaMoneyBillWave,
  FaTachometerAlt,
  FaUser,
} from "react-icons/fa";

const AdminSidebar = () => {
  const navLinkClass = ({ isActive }) =>
    `flex items-center space-x-2 py-2 px-4 rounded hover:bg-blue-700 ${
      isActive ? "bg-blue-500 text-white" : "text-black"
    }`;

  return (
    <div className="bg-white text-black h-screen fixed left-0 top-0 w-64 shadow-md">
      <div className="bg-blue-700 h-12 flex items-center justify-center">
        <h3 className="text-2xl text-white font-bold">Employee N-Dash</h3>
      </div>

      <div className="px-6 py-4 space-y-2">
        <NavLink to="/admin-dashboard" className={navLinkClass} end>
          <FaTachometerAlt />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/admin-dashboard/employees" className={navLinkClass}>
          <FaUser />
          <span>Employee</span>
        </NavLink>

        <NavLink to="/admin-dashboard/departments" className={navLinkClass}>
          <FaBuilding />
          <span>Department</span>
        </NavLink>

        <NavLink to="/admin-dashboard/leaves" className={navLinkClass}>
          <FaCalendarAlt />
          <span>Leave</span>
        </NavLink>

        <NavLink to="/admin-dashboard/salary/add" className={navLinkClass}>
          <FaMoneyBillWave />
          <span>Salary</span>
        </NavLink>

        <NavLink to="/admin-dashboard/settings" className={navLinkClass}>
          <FaCogs />
          <span>Settings</span>
        </NavLink>
      </div>
    </div>
  );
};

export default AdminSidebar;
