import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/authContext.jsx";
import {
  FaBuilding,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaTachometerAlt,
  FaUser,
} from "react-icons/fa";

const Sidebar = () => {
  const { user } = useAuth();

  const navLinkClass = ({ isActive }) =>
    `flex items-center space-x-2 py-2 px-4 rounded hover:bg-blue-700 ${
      isActive ? "bg-blue-500 text-white" : "text-black"
    }`;

  return (
    <div className="bg-white text-black h-screen fixed left-0 top-0 bottom-0 w-64 shadow-md">
      <div className="bg-blue-700 h-12 flex items-center justify-center">
        <h3 className="text-2xl text-white font-bold">Employee N-Dash</h3>
      </div>

      <div className="px-6 py-4 space-y-2">
        <NavLink to="/employee-dashboard" className={navLinkClass} end>
          <FaTachometerAlt />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to={`/employee-dashboard/profile/${user?._id}`}
          className={navLinkClass}
        >
          <FaUser />
          <span>My Profile</span>
        </NavLink>

        <NavLink to="/employee-dashboard/leads" className={navLinkClass}>
          <FaMoneyBillWave />
          <span>Leads</span>
        </NavLink>

        <NavLink to="/employee-dashboard/leaves" className={navLinkClass}>
          <FaBuilding />
          <span>Leaves</span>
        </NavLink>

        <NavLink to="/employee-dashboard/salary" className={navLinkClass}>
          <FaCalendarAlt />
          <span>Salary</span>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
