import React, { useEffect, useState } from "react";
import SummaryCard from "./SummaryCard";
import {
  FaClock,
  FaTimesCircle,
  FaHourglassHalf,
  FaSignInAlt,
  FaCheckCircle,
} from "react-icons/fa";
import axios from "axios";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const AttendanceSummary = ({ userId }) => {
  const [summary, setSummary] = useState({
    onTime: 0,
    halfDays: 0,
    absent: 0,
    lateLogin: 0,
    presentDays: 0,
  });

  const [attendanceArray, setAttendanceArray] = useState([]);
  const [error, setError] = useState("");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState("");

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:3000/api/attendance/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAttendanceArray(response.data?.attendance || []);
        const data = response.data?.attendance || [];
        console.log("Fetched attendance data:", data);
      } catch (err) {
        setError("Failed to fetch attendance summary");
      }
    };

    if (userId) fetchAttendance();
  }, [userId]);

  useEffect(() => {
    const filtered = attendanceArray.filter((entry) => {
      if (!entry.date) return false;
      const date = new Date(entry.date);
      const yearMatch = date.getFullYear() === selectedYear;
      const monthMatch = selectedMonth
        ? date.getMonth() + 1 === parseInt(selectedMonth)
        : true;
      return yearMatch && monthMatch;
    });

    let onTime = 0,
      halfDays = 0,
      absent = 0,
      lateLogin = 0,
      presentDays = 0;

    filtered.forEach((entry) => {
      const status = entry.status?.trim();
      switch (status) {
        case "On Time":
          onTime++;
          presentDays++;
          break;
        case "Half Day":
          halfDays++;
          presentDays++;
          break;
        case "Late Login":
          lateLogin++;
          presentDays++;
          break;
        case "Absent":
          absent++;
          break;
      }
    });

    setSummary({ onTime, halfDays, absent, lateLogin, presentDays });
  }, [attendanceArray, selectedYear, selectedMonth]);

  const chartLabels = ["On Time", "Half Day", "Absent", "Late Login"];
  const chartData = [
    summary.onTime,
    summary.halfDays,
    summary.absent,
    summary.lateLogin,
  ];
  const chartColors = [
    "#16a34a", // green
    "#ec4899", // pink
    "#dc2626", // red
    "#f97316", // orange
  ];

  const total = chartData.reduce((acc, val) => acc + val, 0);
  const percentages = chartData.map((val) =>
    total === 0 ? 0 : ((val / total) * 100).toFixed(1)
  );

  const safeChartData = chartData.map((val) => (val === 0 ? 0.00001 : val));

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="w-full h-full min-h-screen px-3 sm:px-4 bg-gray-100">
      <div className="max-w-[100%] mx-auto">
        <h3 className="text-xl sm:text-2xl font-bold mb-6">
          Attendance Summary
        </h3>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 justify-center mb-6">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="p-2 border rounded-md shadow-sm"
          >
            {[2025, 2024, 2023, 2022].map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="p-2 border rounded-md shadow-sm"
          >
            <option value="">All Months</option>
            {monthNames.map((month, i) => (
              <option key={i + 1} value={i + 1}>
                {month}
              </option>
            ))}
          </select>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <SummaryCard
            icon={<FaCheckCircle />}
            text="Present Days"
            number={summary.presentDays}
            color="bg-blue-600"
          />
          <SummaryCard
            icon={<FaClock />}
            text="On Time"
            number={summary.onTime}
            color="bg-green-600"
          />
          <SummaryCard
            icon={<FaHourglassHalf />}
            text="Half Days"
            number={summary.halfDays}
            color="bg-pink-500"
          />
          <SummaryCard
            icon={<FaTimesCircle />}
            text="Absent"
            number={summary.absent}
            color="bg-red-600"
          />
          <SummaryCard
            icon={<FaSignInAlt />}
            text="Late Login"
            number={summary.lateLogin}
            color="bg-orange-500"
          />
        </div>

        {/* Doughnut Chart */}
        <h3 className="text-xl sm:text-2xl font-bold mt-12 mb-4">
          Attendance Distribution
        </h3>
        <div className="bg-white rounded-lg p-4 shadow-md w-full flex flex-col items-center gap-6">
          <div className="w-full max-w-md h-[350px]">
            <Doughnut
              data={{
                labels: chartLabels,
                datasets: [
                  {
                    data: safeChartData,
                    backgroundColor: chartColors,
                    borderWidth: 2,
                    cutout: "60%",
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,

                plugins: {
                  legend: {
                    position: "top",
                    labels: {
                      usePointStyle: true,
                      pointStyle: "circle",
                      padding: 12,
                      font: { size: 14 },
                    },
                  },
                  datalabels: {
                    color: "#000",
                    formatter: (_, context) => {
                      const percent = percentages[context.dataIndex];
                      return percent === "0.0" ? null : `${percent}%`;
                    },
                    anchor: "end",
                    align: "end",
                    offset: 10,
                    clamp: true,
                    font: {
                      size: 14,
                      weight: "bold",
                    },
                  },
                },
              }}
              plugins={[ChartDataLabels]}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceSummary;
