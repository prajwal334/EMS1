import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./calendar-custom.css"; // <-- define .highlight, .sunday-bg, .saturday-bg

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

  if (!leave) return <div className="text-center mt-10 text-xl">Loading...</div>;

  return (
    <div className="w-full min-h-screen bg-[#eaf0fa] p-8 rounded-lg relative">
      {/* Top Section */}
      <div className="flex items-center justify-between mb-4">
        {/* Profile + Info */}
        <div className="flex items-center gap-4">
          <img
            src={`http://localhost:3000/uploads/${leave.employeeId.userId.profileImage}`}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover border"
          />
          <div>
<h1 className="text-2xl font-bold">
  {(leave.employeeId?.userId?.name || "").toUpperCase()}
</h1>            <p className="text-xl">{leave.employeeId.employeeId}</p>
          </div>
        </div>
        <div>
          <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12H9m12 0A9 9 0 1112 3a9 9 0 019 9z" />
          </svg>
        </div>
      </div>

      {/* Calendar + Reason Section */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Calendar */}
        <div className="bg-white p-4 rounded-md shadow-md w-full md:w-1/2">
          <Calendar
            value={[new Date(leave.startDate), new Date(leave.endDate)]}
            selectRange
            tileClassName={({ date }) => {
              const start = new Date(leave.startDate);
              const end = new Date(leave.endDate);
              if (date >= start && date <= end) return "highlight";
              if (date.getDay() === 0) return "sunday-bg";
              if (date.getDay() === 6) return "saturday-bg";
              return null;
            }}
            tileDisabled={() => true}
          />
        </div>

        {/* Reason Box */}
        <div className="bg-white p-4 rounded-lg shadow-md w-full md:w-1/2 min-h-[250px] flex flex-col">
          <h2 className="text-xl font-bold text-center mb-2 tracking-wider">REASON</h2>
          <p className="text-gray-800 px-2">{leave.reason}</p>
        </div>
      </div>

      {/* Action Buttons */}
      {leave.status === "Pending" && (
        <div className="flex justify-center gap-6 mt-10">
          <button
            onClick={() => changeStatus(leave._id, "Approved")}
            className="bg-[#bde5c8] text-green-700 font-bold text-lg px-10 py-3 rounded-full"
          >
            APPROVE
          </button>
          <button
            onClick={() => changeStatus(leave._id, "Rejected")}
            className="bg-[#f5c3c3] text-red-700 font-bold text-lg px-10 py-3 rounded-full"
          >
            REJECT
          </button>
        </div>
      )}
    </div>
  );
};

export default DetailLeave;
