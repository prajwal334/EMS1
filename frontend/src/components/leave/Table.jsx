// Table.jsx
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { getLeaveColumns, LeaveButtons } from "../../utils/LeaveHelper";
import axios from "axios";
import HeaderImg from "../../assets/images/Salary.jpg"; // Update path as needed

const Table = () => {
  const [leaves, setLeaves] = useState(null);
  const [filteredLeaves, setFilteredLeaves] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState("");

  const fetchLeaves = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/leave", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data.success) {
        let sno = 1;
        const data = response.data.leaves.map((leave) => ({
          _id: leave._id,
          sno: sno++,
          employeeId: leave.employeeId?.employeeId || "N/A",
          name: leave.employeeId?.userId?.name || "N/A",
          userId: leave.employeeId?.userId?._id || "N/A",
          leaveType: leave.leaveType,
          department: leave.employeeId?.department?.dep_name || "N/A",
          days:
            new Date(leave.endDate).getDate() -
            new Date(leave.startDate).getDate(),
          status: leave.status,
          action: <LeaveButtons Id={leave._id} />,
        }));

        setLeaves(data);
        setFilteredLeaves(data);
      }
    } catch (error) {
      if (error.response && !error.response.data.success) {
        alert(error.response.data.error);
      }
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/department", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.data.success) {
        setDepartments(response.data.departments);
      }
    } catch (error) {
      console.error("Error fetching departments", error);
    }
  };

  useEffect(() => {
    fetchLeaves();
    fetchDepartments();
  }, []);

  const filterByInput = (e) => {
    const data = leaves.filter((leave) =>
      leave.name.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredLeaves(data);
  };

  const filterByButton = (status) => {
    const data = leaves.filter((leave) =>
      leave.status.toLowerCase().includes(status.toLowerCase())
    );
    setFilteredLeaves(data);
  };

  const filterByDepartment = (dept) => {
    setSelectedDept(dept);
    if (dept === "") {
      setFilteredLeaves(leaves);
    } else {
      const filtered = leaves.filter((leave) =>
        leave.department.toLowerCase().includes(dept.toLowerCase())
      );
      setFilteredLeaves(filtered);
    }
  };

  return (
    <>
      {filteredLeaves ? (
        <div className="">
          {/* 🔷 Header Image */}
          <div className="w-full h-60 mb-6 rounded-3xl overflow-hidden shadow-md">
            <img
              src={HeaderImg}
              alt="Header"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="text-center p-3">
          {/* 🔍 Filters */}
          <div className="flex  flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <input
              type="text"
              placeholder="Search by name..."
              className="border border-gray-300 rounded px-4 py-2 shadow-lg w-full sm:w-72"
              onChange={filterByInput}
            />

            {/* 🔘 Department Filter */}
            <select
              value={selectedDept}
              onChange={(e) => filterByDepartment(e.target.value)}
              className="border border-gray-300 rounded px-4 py-2 shadow-lg w-full sm:w-72"
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept._id} value={dept.dep_name}>
                  {dept.dep_name}
                </option>
              ))}
            </select>

            {/* 🔘 Status Filters */}
            <div className="space-x-2">
              <button
                className="bg-blue-500 shadow-lg text-white px-3 py-2 rounded"
                onClick={() => filterByButton("Pending")}
              >
                Pending
              </button>
              <button
                className="bg-green-500 shadow-lg text-white px-3 py-2 rounded"
                onClick={() => filterByButton("Approved")}
              >
                Approved
              </button>
              <button
                className="bg-red-500 shadow-lg text-white px-3 py-2 rounded"
                onClick={() => filterByButton("Rejected")}
              >
                Rejected
              </button>
            </div>
          </div>
          
          {/* 📋 Leave Table */}
          <DataTable
            columns={getLeaveColumns()}
            data={filteredLeaves}
            pagination
            striped
            highlightOnHover
            responsive
            noDataComponent={
              <div className="py-4 text-gray-500">No leaves found.</div>
            }
          />
        </div>
        </div>
      ) : (
        <div className="p-6 text-center text-gray-500">Loading...</div>
      )}
    </>
  );
};

export default Table;
