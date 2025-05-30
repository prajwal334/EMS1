import React from "react";
import LeaveSummary from "./LeaveSummary";
import AttendanceSummary from "../attendance/AttendanceSummary";
import { useAuth } from "../../context/authContext";

const EmployeeDashboard = () => {
  const { user } = useAuth();

  if (!user) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">
        Employee Dashboard
      </h3>
      <LeaveSummary userId={user._id} />
      <br />
      {/* Attendance Summary Section */}
      <div className="mt-12">
        <AttendanceSummary userId={user?._id} />
      </div>
    </div>
  );
};

export default EmployeeDashboard;
