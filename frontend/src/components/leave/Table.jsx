import React from "react";

const Table = () => {
    return (
        <div className="p-6">
        <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Leave List</h3>
            </div>
            <div className="flex justify-between items-center">
                <input
                    type="text"
                    placeholder="Search..."
                    className="border border-gray-300 rounded px-0.4 py-0.5 mb-4"
                />
                <div className="space-x-3">
                    <button className="bg-blue-500 text-white px-2 py-1 rounded">Pending</button>
                    <button className="bg-green-500 text-white px-2 py-1 rounded">Approved</button>
                    <button className="bg-red-500 text-white px-2 py-1 rounded">Rejected</button>
                    </div>
            </div>
            </div>
    )
}
export default Table;