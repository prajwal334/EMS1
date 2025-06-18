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
<<<<<<< Updated upstream
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);
=======
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement, CategoryScale, LinearScale, Legend, Tooltip);

const timeToMinutes = (timeStr) => {
  if (!timeStr) return null;
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
};

const minutesToTimeString = (mins) => {
  if (mins === null || mins === undefined) return "--:--";
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
};
>>>>>>> Stashed changes

const AttendanceSummary = ({ userId }) => {
  const [summary, setSummary] = useState({
    onTime: 0,
    halfDays: 0,
    absent: 0,
    lateLogin: 0,
    presentDays: 0,
  });

<<<<<<< Updated upstream
  const [attendanceArray, setAttendanceArray] = useState([]);
  const [error, setError] = useState("");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date().toDateString());
=======
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [error, setError] = useState("");
  const [attendanceArray, setAttendanceArray] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState("");
  const [dateStatusMap, setDateStatusMap] = useState({});
  const [dateLoginMap, setDateLoginMap] = useState({});
>>>>>>> Stashed changes

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

<<<<<<< Updated upstream
  const fetchAttendance = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:3000/api/login-history/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const rawData = response.data?.data || [];
      console.log("📦 Raw attendance data from API:", rawData);

      const normalizedData = rawData.map((entry) => ({
        ...entry,
        status: entry.status?.trim().toLowerCase(),
      }));

      setAttendanceArray(normalizedData);
    } catch (err) {
      console.error("❌ Error fetching attendance data:", err);
      setError("Failed to fetch attendance summary");
    }
  };

  useEffect(() => {
  if (!userId) return;

  fetchAttendance(); // initial call

  const interval = setInterval(() => {
    const newDate = new Date().toDateString();
    if (newDate !== currentDate) {
      setCurrentDate(newDate);
      fetchAttendance();
    }
  }, 30 * 60 * 1000);

  return () => clearInterval(interval);
}, [userId]);


  useEffect(() => {
    const validStatuses = [
      "on time",
      "late",
      "late login",
      "half day",
      "absent",
    ];
    const statusPriority = {
      "on time": 1,
      late: 2,
      "late login": 2,
      "half day": 3,
      absent: 4,
    };

    const filtered = attendanceArray.filter((entry) => {
      if (!entry.date || !entry.status) return false;
=======
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:3000/api/attendance/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAttendanceArray(response.data?.attendance || []);
      } catch (err) {
        setError("Failed to fetch attendance summary");
      }
    };

    if (userId) fetchAttendance();
  }, [userId]);

  useEffect(() => {
    const filtered = attendanceArray.filter((entry) => {
      if (!entry.date) return false;
>>>>>>> Stashed changes
      const date = new Date(entry.date);
      const yearMatch = date.getFullYear() === selectedYear;
      const monthMatch = selectedMonth
        ? date.getMonth() + 1 === parseInt(selectedMonth)
        : true;
<<<<<<< Updated upstream

      const isValid = validStatuses.includes(entry.status);
      if (!isValid) console.warn("❗ Unknown status ignored:", entry.status);

      return yearMatch && monthMatch && isValid;
    });

    const normalizedByDate = {};
    filtered.forEach((entry) => {
      const dateKey = new Date(entry.date).toDateString();
      const current = normalizedByDate[dateKey];
      if (
        !current ||
        statusPriority[entry.status] < statusPriority[current.status]
      ) {
        normalizedByDate[dateKey] = entry;
      }
    });

    const uniqueEntries = Object.values(normalizedByDate);
    console.log("🎯 Normalized attendance entries:", uniqueEntries);

=======
      return yearMatch && monthMatch;
    });

>>>>>>> Stashed changes
    let onTime = 0,
      halfDays = 0,
      absent = 0,
      lateLogin = 0,
      presentDays = 0;

<<<<<<< Updated upstream
    uniqueEntries.forEach((entry) => {
      const status = entry.status;
      switch (status) {
        case "on time":
          onTime++;
          presentDays++;
          break;
        case "late":
        case "late login":
          lateLogin++;
          presentDays++;
          break;
        case "half day":
          halfDays++;
          presentDays++;
          break;
        case "absent":
          absent++;
          break;
        default:
=======
    const dateStatus = {};
    const dateLoginTimes = {};

    filtered.forEach((entry) => {
      if (!entry.date || !entry.status) return;
      const dateKey = new Date(entry.date).toISOString().split("T")[0];
      const status = entry.status.trim();
      dateStatus[dateKey] = status;

      if (entry.loginTime) {
        const loginMinutes = timeToMinutes(entry.loginTime);
        dateLoginTimes[dateKey] = loginMinutes;
      } else {
        dateLoginTimes[dateKey] = null;
      }

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
>>>>>>> Stashed changes
          break;
      }
    });

    setSummary({ onTime, halfDays, absent, lateLogin, presentDays });
<<<<<<< Updated upstream
  }, [attendanceArray, selectedYear, selectedMonth]);

  const chartLabels = ["On Time", "Half Day", "Absent", "Late Login"];
  const chartData = [
    summary.onTime,
    summary.halfDays,
    summary.absent,
    summary.lateLogin,
  ];
  const chartColors = ["#16a34a", "#ec4899", "#dc2626", "#f97316"];
  const total = chartData.reduce((acc, val) => acc + val, 0);
  const safeChartData = chartData.map((val) => (val === 0 ? 0.00001 : val));
=======
    setDateStatusMap(dateStatus);
    setDateLoginMap(dateLoginTimes);

    const daysInMonth = new Date(
      selectedYear,
      selectedMonth || new Date().getMonth() + 1,
      0
    ).getDate();

    const labels = Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      return new Date(
        selectedYear,
        (selectedMonth || new Date().getMonth() + 1) - 1,
        day
      )
        .toISOString()
        .split("T")[0];
    });

    const dataPoints = labels.map((date) =>
      dateLoginTimes[date] !== undefined ? dateLoginTimes[date] : null
    );

    const barColors = labels.map((date) => {
      switch (dateStatus[date]) {
        case "On Time":
          return "green";
        case "Half Day":
          return "pink";
        case "Absent":
          return "red";
        case "Late Login":
          return "orange";
        default:
          return "gray";
      }
    });

    const dataset = {
      label: "Login Time (minutes from midnight)",
      data: dataPoints,
      backgroundColor: barColors,
      borderRadius: 4,
      borderSkipped: false,
      spanGaps: true,
    };

    setChartData({ labels, datasets: [dataset] });
  }, [attendanceArray, selectedYear, selectedMonth]);
>>>>>>> Stashed changes

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="w-full h-full min-h-screen px-3 sm:px-4 bg-gray-100">
      <div className="max-w-[100%] mx-auto">
<<<<<<< Updated upstream

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-16">
=======
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
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
        
        {/* Filters */}
        <div className="flex flex-wrap gap-4 justify-center mb-2">
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

        {/* Doughnut Chart */}
       
        <div className="bg-white rounded-lg p-6 shadow-md w-full h-[480px] flex flex-col items-center gap-12">
          <div className="w-full max-w-md h-[410px]">
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
                    formatter: (value, context) => {
                      const total = context.chart.data.datasets[0].data.reduce(
                        (a, b) => a + b,
                        0
                      );
                      const percent = (value / total) * 100;
                      return percent > 0.5 ? `${percent.toFixed(1)}%` : "";
                    },
                    font: {
                      size: 14,
                      weight: "bold",
                    },
                    anchor: "center",
                    align: "center",
                    clamp: true,
                  },
                },
              }}
              plugins={[ChartDataLabels]}
            />
=======
        {/* Bar Chart */}
        <h3 className="text-xl sm:text-2xl font-bold mt-12 mb-6">
          Daily Login Time Overview
        </h3>
        <div className="bg-white rounded-lg p-6 shadow-md overflow-x-auto w-full">
          <div style={{ width: "100%", height: "300px" }}>
            {chartData.labels.length > 0 ? (
              <Bar
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      callbacks: {
                        label: (context) => {
                          const date = context.label;
                          const status = dateStatusMap[date] || "No Data";
                          const loginMins = dateLoginMap[date];
                          const timeStr = minutesToTimeString(loginMins);
                          return `${date} - Status: ${status} - Login Time: ${timeStr}`;
                        },
                      },
                    },
                  },
                  scales: {
                    y: {
                      min: 0,
                      max: 24 * 60,
                      ticks: {
                        stepSize: 120,
                        callback: (value) => minutesToTimeString(value),
                      },
                      title: {
                        display: true,
                        text: "Login Time (HH:MM)",
                      },
                      grid: { color: "#ddd" },
                    },
                    x: {
                      ticks: {
                        autoSkip: true,
                        maxTicksLimit: 15,
                        callback: (_, index) =>
                          new Date(chartData.labels[index]).getDate(),
                      },
                      title: {
                        display: true,
                        text: "Date (Day of Month)",
                      },
                      grid: { color: "#eee" },
                    },
                  },
                }}
              />
            ) : (
              <p className="text-center text-gray-600">No data to display</p>
            )}
          </div>
          {/* Custom Legend */}
          <div className="flex flex-wrap justify-center mt-4 gap-4">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 bg-green-600 inline-block rounded-sm"></span>
              <span className="text-sm text-gray-700">On Time</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 bg-orange-500 inline-block rounded-sm"></span>
              <span className="text-sm text-gray-700">Late Login</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 bg-pink-500 inline-block rounded-sm"></span>
              <span className="text-sm text-gray-700">Half Day</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 bg-red-600 inline-block rounded-sm"></span>
              <span className="text-sm text-gray-700">Absent</span>
            </div>
>>>>>>> Stashed changes
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceSummary;
