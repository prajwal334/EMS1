import React, { useEffect, useState } from "react";
import SummaryCard from "./SummaryCard";
import {
  FaClock,
  FaPlaneDeparture,
  FaAward,
  FaThermometerHalf,
} from "react-icons/fa";
import axios from "axios";

const LeaveSummary = ({ userId }) => {
  const [leaveStats, setLeaveStats] = useState({
    totalLeave: 36,
    casualLeave: 24,
    earnedLeave: 12,
    sickLeave: 12,
  });

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/leave/user/${userId}`
        );
        const leaves = res.data.leaves || [];

        // Filter approved leaves
        const approvedLeaves = leaves.filter(
          (leave) => leave.status === "Approved"
        );

        // Count approved leaves by type
        const approvedCounts = approvedLeaves.reduce(
          (acc, leave) => {
            if (leave.leaveType === "Casual Leave") acc.casual++;
            else if (leave.leaveType === "Sick Leave") acc.sick++;
            else acc.other++; // for earned or any other leave types
            acc.total++;
            return acc;
          },
          { casual: 0, sick: 0, other: 0, total: 0 }
        );

        setLeaveStats({
          totalLeave: 36 - approvedCounts.total,
          casualLeave: 24 - approvedCounts.casual,
          earnedLeave: 12 - approvedCounts.other,
          sickLeave: 12 - approvedCounts.sick,
        });
      } catch (error) {
        console.error("Failed to fetch leave data:", error);
      }
    };

    fetchLeaves();
  }, [userId]);

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          icon={<FaClock />}
          text="Total Leave"
          number={leaveStats.totalLeave}
          color="bg-red-500"
        />
        <SummaryCard
          icon={<FaAward />}
          text="Earned Leave"
          number={leaveStats.earnedLeave}
          color="bg-green-600"
        />
        <SummaryCard
          icon={<FaPlaneDeparture />}
          text="Casual Leave"
          number={leaveStats.casualLeave}
          color="bg-blue-500"
        />
        <SummaryCard
          icon={<FaThermometerHalf />}
          text="Sick Leave"
          number={leaveStats.sickLeave}
          color="bg-purple-600"
        />
      </div>
    </div>
  );
};

export default LeaveSummary;
