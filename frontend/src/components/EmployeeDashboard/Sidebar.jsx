import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/authContext.jsx";
import {
  FaChartLine,
  FaIdBadge,
  FaBullhorn,
  FaUmbrellaBeach,
  FaRegCalendarCheck,
  FaHandHoldingUsd,
  FaClock,
  FaComments,
} from "react-icons/fa";

const Sidebar = () => {
  const { user } = useAuth();

  const navLinkClass = ({ isActive }) =>
    `${
      isActive ? "bg-blue-500" : ""
    } flex items-center space-x-3 py-2 px-4 rounded hover:bg-blue-700`;

  return (
    <div className="bg-orange-300 text-black h-screen fixed left-0 top-0 bottom-0 w-64">
      <div className="bg-blue-700 h-12 flex items-center justify-center">
        <h3 className="text-2xl text-white font-bold text-center">
          Employee N-Dash
        </h3>
      </div>

      <div className="px-8 py-4 space-y-2">
        <NavLink to="/employee-dashboard" className={navLinkClass} end>
          <FaChartLine className="text-xl text-white" />
          <span className="text-white font-medium">Dashboard</span>
        </NavLink>

        <NavLink
          to={`/employee-dashboard/profile/${user?._id}`}
          className={navLinkClass}
        >
          <FaIdBadge className="text-lg text-white" />
          <span className="text-white font-medium">My Profile</span>
        </NavLink>

        <NavLink to="/employee-dashboard/leads" className={navLinkClass}>
          <FaBullhorn className="text-lg text-white" />
          <span className="text-white font-medium">Task</span>
        </NavLink>

        <NavLink
          to={`/employee-dashboard/leaves/${user?._id}`}
          className={navLinkClass}
        >
          <FaUmbrellaBeach className="text-lg text-white" />
          <span className="text-white font-medium">Leaves</span>
        </NavLink>

        <NavLink
          to={`/employee-dashboard/groups/${user?._id}`}
          className={navLinkClass}
        >
          <FaComments className="text-white" />
          <span className="text-white font-medium ml-2">Group Chat</span>
        </NavLink>

        <NavLink
          to={`/employee-dashboard/salary/${user?._id}`}
          className={navLinkClass}
        >
          <FaHandHoldingUsd className="text-lg text-white" />
          <span className="text-white font-medium">Salary</span>
        </NavLink>

        <NavLink
          to={`/employee-dashboard/login-history/${user?._id}`}
          className={navLinkClass}
        >
          <FaClock className="text-lg text-white" />
          <span className="text-white font-medium">Attendance</span>
        </NavLink>

        <NavLink
          to={`/employee-dashboard/teams/user/${user?._id}`}
          className={navLinkClass}
        >
          <FaClock className="text-lg text-white" />
          <span className="text-white font-medium">Team</span>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
