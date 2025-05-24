import React, { useEffect, useState } from "react";
import SummaryCard from "./SummaryCard.jsx";
import {
  FaClock,
  FaPlaneDeparture,
  FaAward,
  FaThermometerHalf,
} from "react-icons/fa";
import axios from "axios";
import { useAuth } from "../../context/authContext";

const AdminSummary = () => {
  const [stats, setStats] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      if (!user?._id) return;
      try {
        const res = await axios.get(
          `http://localhost:3000/api/attendance/stats/${user._id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (res.data.success) {
          setStats(res.data.stats);
        } else {
          console.warn("Stats not returned:", res.data);
        }
      } catch (err) {
        console.error("❌ Failed to fetch stats:", err);
      }
    };

    fetchStats();
  }, [user?.userId]);

  if (!stats) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">
        Dashboard Overview
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <SummaryCard
          icon={<FaClock />}
          text="Total leave"
          number={stats.totalLeave}
          color="bg-red-500"
        />
        <SummaryCard
          icon={<FaPlaneDeparture />}
          text="Casual Leave"
          number={stats.casualLeave}
          color="bg-blue-500"
        />
        <SummaryCard
          icon={<FaAward />}
          text="Earned Leave"
          number={stats.earnedLeave}
          color="bg-green-600"
        />
        <SummaryCard
          icon={<FaThermometerHalf />}
          text="Sick Leave"
          number={stats.sickLeave}
          color="bg-purple-600"
        />
      </div>
    </div>
  );
};

export default AdminSummary;
