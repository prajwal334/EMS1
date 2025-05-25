import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./calendar-custom.css"; // ⬅️ Custom styling (create this file)

const DetailLeave = () => {
  const { id } = useParams();
  const [leave, setLeave] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeave = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/leave/detail/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.data.success) {
          setLeave(response.data.leave);
        }
      } catch (error) {
        if (error.response && !error.response.data.success) {
          alert(error.response.data.error);
        }
      }
    };
    fetchLeave();
  }, [id]);

  const changeStatus = async (id, status) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/api/leave/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.success) {
        navigate("/admin-dashboard/leaves");
      }
    } catch (error) {
      if (error.response && !error.response.data.success) {
        alert(error.response.data.error);
      }
    }
  };

  return leave ? (
    <div className="max-w-3xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-6">Employee Leave Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Image */}
        <div>
          <img
            src={`http://localhost:3000/uploads/${leave.employeeId.userId.profileImage}`}
            className="rounded-full border w-72"
            alt="Employee Profile"
          />
        </div>

        {/* Leave Details */}
        <div>
          {[
            ["Name", leave.employeeId.userId.name],
            ["Employee ID", leave.employeeId.employeeId],
            ["Leave Type", leave.leaveType],
            ["Reason", leave.reason],
            ["Department", leave.employeeId.department?.dep_name || "N/A"],
          ].map(([label, value]) => (
            <div className="flex space-x-4 mb-2" key={label}>
              <p className="font-bold">{label}:</p>
              <p>{value}</p>
            </div>
          ))}

          {/* Status or Action Buttons */}
          <div className="flex space-x-4 mt-4 items-center">
            <p className="font-bold">
              {leave.status === "Pending" ? "Action" : "Status"}:
            </p>
            {leave.status === "Pending" ? (
              <div className="flex gap-4">
                <button
                  className="bg-green-500 text-white px-3 py-1 rounded"
                  onClick={() => changeStatus(leave._id, "Approved")}
                >
                  Approve
                </button>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded"
                  onClick={() => changeStatus(leave._id, "Rejected")}
                >
                  Reject
                </button>
              </div>
            ) : (
              <p>{leave.status}</p>
            )}
          </div>
        </div>
      </div>

      {/* Calendar Display */}
      <div className="mt-6">
        <p className="text-lg font-bold mb-2">Leave Calendar:</p>
        <Calendar
          value={[new Date(leave.startDate), new Date(leave.endDate)]}
          selectRange
          tileClassName={({ date }) => {
            const start = new Date(leave.startDate);
            const end = new Date(leave.endDate);

            // Highlight leave range
            if (date >= start && date <= end) {
              return "highlight";
            }

            // Sunday
            if (date.getDay() === 0) return "sunday-bg";

            // Saturday
            if (date.getDay() === 6) return "saturday-bg";

            return null;
          }}
          tileDisabled={() => true}
        />
      </div>
    </div>
  ) : (
    <div className="text-center mt-10 text-xl">Loading...</div>
  );
};

export default DetailLeave;
