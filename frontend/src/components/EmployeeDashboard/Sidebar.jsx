import React from "react";

const Sidebar =() => {
    return (
        <div className="flex flex-col w-64 h-screen bg-gray-800 text-white">
            <div className="flex items-center justify-center h-16 bg-gray-900">
                <h1 className="text-2xl font-bold">Employee Dashboard</h1>
            </div>
            <nav className="flex flex-col mt-4">
                <a href="/employee/dashboard" className="px-4 py-2 hover:bg-gray-700">Dashboard</a>
                <a href="/employee/profile" className="px-4 py-2 hover:bg-gray-700">Profile</a>
                <a href="/employee/tasks" className="px-4 py-2 hover:bg-gray-700">Tasks</a>
                <a href="/employee/reports" className="px-4 py-2 hover:bg-gray-700">Reports</a>
            </nav>
        </div>
    );
}

export default Sidebar;