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

const Sidebar = () => {
    return (
        <div className="bg-white text-black h-screen fixed left-0 top-0 bottom-0 space-y-4 w-64">
            <div className="bg-blue-700 h-12 flex items-center justify-center">
                <h3 className="text-2xl text-white text-center font-bold">Employee N-Dash</h3>
            </div>
            <div className="px-6 py-4 space-y-2">
                <NavLink to="/employee-dashboard"
                    className={({isActive}) => `${isActive ? "bg-teal-500" : ""} flex items-center space-x-2 py-2 px-4 rounded`}
                    end>
                    <FaTachometerAlt />
                    <span>Dashboard</span>
                </NavLink>
                <NavLink to="/employee-dashboard/profile"
                    className={({isActive}) => `${isActive ? "bg-teal-500" : ""} flex items-center space-x-2 py-2 px-4 rounded`}
                    >
                    <FaUser />
                    <span>My-Profile</span>
                </NavLink>
                 <NavLink to="/employee-dashboard/leads"
                className="flex items-center space-x-2 py-2 px-4 rounded hover:bg-blue-700">
                    <FaMoneyBillWave />
                    <span>Leads</span>
                </NavLink>
                <NavLink to="/employee-dashboard/leaves"
                    className={({isActive}) => `${isActive ? "bg-teal-500" : ""} flex items-center space-x-2 py-2 px-4 rounded`}>
                    <FaBuilding />
                    <span>Leaves</span>
                </NavLink>
                <NavLink to="/employee-dashboard/salary"
                className="flex items-center space-x-2 py-2 px-4 rounded hover:bg-blue-700">
                    <FaCalendarAlt />
                    <span>Salary</span>
                </NavLink>
               
                <NavLink to="/admin-dashboard"
                className="flex items-center space-x-2 py-2 px-4 rounded hover:bg-blue-700">
                    <FaCogs />
                    <span>Settings</span>
                </NavLink>
            </div>
        </div>
    )
}

export default Sidebar;
