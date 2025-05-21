import React from "react";
import SummaryCard from "./SummaryCard.jsx";
import {
  FaUsers,
  FaBan,
  FaClock,
  FaHourglassHalf,
  FaPlaneDeparture,
  FaAward,
  FaThermometerHalf,
} from "react-icons/fa";

const AdminSummary = () => {
  return (
    <div className="p-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">Dashboard Overview</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <SummaryCard
          icon={<FaUsers />}
          text="Presence"
          number={13}
          color="bg-teal-600"
        />
        <SummaryCard
          icon={<FaBan />}
          text="LOP (Loss Of Pay)"
          number={5}
          color="bg-yellow-500"
        />
        <SummaryCard
          icon={<FaClock />}
          text="Late Login"
          number={0}
          color="bg-red-500"
        />
        <SummaryCard
          icon={<FaHourglassHalf />}
          text="Halfday"
          number={0}
          color="bg-orange-500"
        />
        <SummaryCard
          icon={<FaPlaneDeparture />}
          text="Total Casual Leave"
          number={24}
          color="bg-blue-500"
        />
        <SummaryCard
          icon={<FaAward />}
          text="Earned Leave"
          number={12}
          color="bg-green-600"
        />
        <SummaryCard
          icon={<FaThermometerHalf />}
          text="Sick Leave"
          number={12}
          color="bg-purple-600"
        />
      </div>
    </div>
  );
};

export default AdminSummary;
