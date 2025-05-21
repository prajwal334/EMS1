// Table.jsx
import React, { useEffect } from "react";
import DataTable from "react-data-table-component";
import { getLeaveColumns, LeaveButtons } from "../../utils/LeaveHelper";
import axios from "axios";

const Table = () => {
  const [leaves, setLeaves] = React.useState(null);
  const [filteredLeaves, setFilteredLeaves] = React.useState(null);

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
      console.log(response.data.leaves);
    } catch (error) {
      if (error.response && !error.response.data.success) {
        alert(error.response.data.error);
      }
    }
  };
  useEffect(() => {
    fetchLeaves();
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

  return (
    <>
      {filteredLeaves ? (
        <div className="p-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Leave List</h3>
          </div>
          <div className="flex justify-between items-center">
            <input
              type="text"
              placeholder="Search..."
              className="border border-gray-300 rounded px-0.4 py-0.5 mb-4"
              onChange={filterByInput}
            />
            <div className="space-x-3">
              <button
                className="bg-blue-500 text-white px-2 py-1 rounded"
                onClick={() => filterByButton("Pending")}
              >
                Pending
              </button>
              <button
                className="bg-green-500 text-white px-2 py-1 rounded"
                onClick={() => filterByButton("Approved")}
              >
                Approved
              </button>
              <button
                className="bg-red-500 text-white px-2 py-1 rounded"
                onClick={() => filterByButton("Rejected")}
              >
                Rejected
              </button>
            </div>
          </div>
          <DataTable
            columns={getLeaveColumns()}
            data={filteredLeaves}
            pagination
          />
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
};
export default Table;
