import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaBuilding,
  FaCalendarCheck,
  FaCogs,
  FaMoneyBillWave,
  FaTachometerAlt,
  FaUser,
} from "react-icons/fa";

const AdminSidebar = () => {
  return (
    <div className="bg-white text-black h-screen fixed left-0 top-0 bottom-0 space-y-4 w-64">
      <div className="bg-blue-700 h-12 flex items-center justify-center">
        <h3 className="text-2xl text-white text-center font-bold">
          Employee N-Dash
        </h3>
      </div>
      <div className="px-6 py-4 space-y-2">
        <NavLink
          to="/admin-dashboard"
          className={({ isActive }) =>
            `${
              isActive ? "bg-blue-500" : ""
            } flex items-center space-x-2 py-2 px-4 rounded`
          }
          end
        >
          <FaTachometerAlt />
          <span>Dashboard</span>
        </NavLink>
        <NavLink
          to="/admin-dashboard/employees"
          className={({ isActive }) =>
            `${
              isActive ? "bg-blue-500" : ""
            } flex items-center space-x-2 py-2 px-4 rounded hover:bg-blue-700`
          }
        >
          <FaUser />
          <span>Employee</span>
        </NavLink>
        <NavLink
          to="/admin-dashboard/departments"
          className={({ isActive }) =>
            `${
              isActive ? "bg-blue-500" : ""
            } flex items-center space-x-2 py-2 px-4 rounded hover:bg-blue-700`
          }
        >
          <FaBuilding />
          <span>Department</span>
        </NavLink>
        <NavLink
          to="/admin-dashboard/leaves"
          className={({ isActive }) =>
            `${
              isActive ? "bg-blue-500" : ""
            } flex items-center space-x-2 py-2 px-4 rounded hover:bg-blue-700`
          }
        >
           <FaCalendarCheck /> 
          <span>Leave</span>
        </NavLink>
        <NavLink
          to="/admin-dashboard/salary/add"
          className={({ isActive }) =>
            `${
              isActive ? "bg-blue-500" : ""
            } flex items-center space-x-2 py-2 px-4 rounded hover:bg-blue-700`
          }>
          <FaMoneyBillWave />
          <span>Salary</span>
        </NavLink>
        
      </div>
    </div>
  );
};

export default AdminSidebar;
