import React from "react";
import EmployeeSideBar from "../components/EmployeeDashboard/Sidebar.jsx";
import Navbar from "../components/dashboard/Navbar.jsx";
import { Outlet } from "react-router-dom";

const EmployeeDashboard = () => {
    return (
         <div className='flex'>
      <EmployeeSideBar />
      <div className='flex-1 ml-64 bg-gray-100 h-screen'>
        <Navbar />
        <Outlet />
      </div>
    </div>
    );
} 

export default EmployeeDashboard;