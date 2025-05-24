import React, { useEffect, useState } from "react";
import axios from "axios";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const DepartmentWiseAttendance = () => {
  const [departments, setDepartments] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState("");
  const [attendanceData, setAttendanceData] = useState({});

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
    const fetchDepartments = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:3000/api/department", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const fetchedDepartments = res.data.departments || [];
      console.log("Fetched departments:", fetchedDepartments);
      setDepartments(fetchedDepartments);
    };
    fetchDepartments();
  }, []);

  useEffect(() => {
    const fetchAttendance = async () => {
      const token = localStorage.getItem("token");
      const targetDeps = departments.map((d) => d._id);
      const allData = {};

      await Promise.all(
        targetDeps.map(async (depId) => {
          try {
            const res = await axios.get(
              `http://localhost:3000/api/attendance/department/${depId}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );

            const data = res.data.data || [];
            console.log(`Raw attendance for department ${depId}:`, data);

            const summary = {
              "On Time": 0,
              "Half Day": 0,
              "Late Login": 0,
              Absent: 0,
            };

            data.forEach((emp) => {
              // Include if department id matches exactly
              if (emp.department === depId) {
                emp.attendance.forEach((entry) => {
                  const date = new Date(entry.date);
                  const matchYear = date.getFullYear() === Number(selectedYear);
                  const matchMonth = selectedMonth
                    ? date.getMonth() + 1 === Number(selectedMonth)
                    : true;

                  if (matchYear && matchMonth) {
                    const status = entry.status?.trim();
                    if (Object.prototype.hasOwnProperty.call(summary, status)) {
                      summary[status]++;
                    }
                  }
                });
              }
            });

            console.log(`Processed summary for department ${depId}:`, summary);
            allData[depId] = summary;
          } catch (err) {
            console.error(
              `Error fetching attendance for department ${depId}:`,
              err
            );
            allData[depId] = {
              "On Time": 0,
              "Half Day": 0,
              "Late Login": 0,
              Absent: 0,
            };
          }
        })
      );

      setAttendanceData(allData);
      console.log("Final attendanceData:", allData);
    };

    if (departments.length > 0) fetchAttendance();
  }, [departments, selectedYear, selectedMonth]);

  const renderChart = (depId, depName) => {
    const summary = attendanceData[depId] || {
      "On Time": 0,
      "Half Day": 0,
      "Late Login": 0,
      Absent: 0,
    };

    const chartLabels = ["On Time", "Half Day", "Late Login", "Absent"];
    const chartColors = ["#16a34a", "#ec4899", "#fb923c", "#dc2626"];
    const chartData = chartLabels.map((label) => summary[label] || 0.00001);
    const total = chartData.reduce((acc, val) => acc + val, 0);
    const percentages = chartData.map((val) =>
      total === 0 ? 0 : ((val / total) * 100).toFixed(1)
    );

    return (
      <div
        key={depId}
        className="bg-gray-50 rounded-lg p-4 shadow hover:shadow-lg transform hover:scale-105 transition duration-300 ease-in-out"
      >
        <h3 className="text-lg font-bold text-center mb-4">{depName}</h3>
        <div className="w-full h-[250px]">
          <Doughnut
            data={{
              labels: chartLabels,
              datasets: [
                {
                  data: chartData,
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
                  display: false,
                },
                datalabels: {
                  color: "#000",
                  formatter: (_, context) => {
                    const percent = percentages[context.dataIndex];
                    return `${percent}%`;
                  },
                  anchor: "end",
                  align: "end",
                  offset: 8,
                  font: {
                    size: 12,
                    weight: "bold",
                  },
                },
              },
            }}
            plugins={[ChartDataLabels]}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 px-4 py-6">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Department-wise Attendance
      </h2>

      <div className="flex flex-wrap justify-center items-center gap-4 mb-8">
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="p-2 border rounded"
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
          className="p-2 border rounded"
        >
          <option value="">All Months</option>
          {monthNames.map((month, idx) => (
            <option key={idx + 1} value={idx + 1}>
              {month}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-md">
        <div className="flex justify-center mb-4">
          <ul className="flex gap-6 text-sm font-medium">
            {["On Time", "Half Day", "Late Login", "Absent"].map(
              (label, index) => (
                <li key={label} className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full inline-block"
                    style={{
                      backgroundColor: [
                        "#16a34a",
                        "#ec4899",
                        "#fb923c",
                        "#dc2626",
                      ][index],
                    }}
                  ></span>
                  {label}
                </li>
              )
            )}
          </ul>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {departments.map((dep) => renderChart(dep._id, dep.dep_name))}
        </div>
      </div>
    </div>
  );
};

export default DepartmentWiseAttendance;
