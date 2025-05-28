import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";
import { useAuth } from "../../context/authContext";
import "./AttendanceCalendar.css";

const AttendanceCalendar = () => {
  const { user } = useAuth();
  const token = localStorage.getItem("token");

  const [attendanceData, setAttendanceData] = useState([]);
  const [selectedDateData, setSelectedDateData] = useState(null);

  const formatDate = (date) => date.toLocaleDateString("en-CA");

  const isToday = (someDate) => {
    const today = new Date();
    return (
      someDate.getDate() === today.getDate() &&
      someDate.getMonth() === today.getMonth() &&
      someDate.getFullYear() === today.getFullYear()
    );
  };

  const normalizeStatus = (status) => {
    const normalized = status?.toLowerCase() || "";
    if (normalized.includes("on time")) return "On Time";
    if (normalized.includes("late")) return "Late";
    if (normalized.includes("half")) return "Half Day";
    if (normalized.includes("holiday")) return "Holiday";
    if (normalized.includes("sunday")) return "Sunday";
    return "No Login";
  };

  const fetchAttendance = async () => {
    try {
      if (!user?._id) return;

      const res = await axios.get(
        `http://localhost:3000/api/login-history/${user._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const groupedByDate = {};

      res.data.forEach((entry) => {
        // Prefer entry.date if it's valid, else derive from loginTime
        let dateObj;
        if (entry.date && !isNaN(new Date(entry.date))) {
          dateObj = new Date(entry.date);
        } else if (entry.loginTime) {
          dateObj = new Date(entry.loginTime);
        } else {
          return; // skip invalid entries
        }

        const dateStr = dateObj.toLocaleDateString("en-CA");

        if (!groupedByDate[dateStr]) {
          groupedByDate[dateStr] = [];
        }

        groupedByDate[dateStr].push(entry);
      });

      const formatted = Object.entries(groupedByDate).map(([date, entries]) => {
        const validEntry =
          entries.find(
            (e) => e.status && e.status.toLowerCase() !== "unknown"
          ) || entries[0];

        const loginTime = validEntry.loginTime
          ? new Date(validEntry.loginTime).toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })
          : null;

        const logoutTime = validEntry.logoutTime
          ? new Date(validEntry.logoutTime).toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })
          : null;

        return {
          date,
          status: normalizeStatus(validEntry.status),
          loginTime,
          logoutTime,
        };
      });

      setAttendanceData(formatted);
    } catch (err) {
      console.error("Error fetching login history:", err);
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchAttendance();
    }
  }, [user]);

  const getStatusForDate = (date) => {
    const dateStr = formatDate(date);
    const record = attendanceData.find((entry) => entry.date === dateStr);
    return record?.status || (isToday(date) ? "No Login (Today)" : "No Login");
  };

  const getTileClassName = ({ date }) => {
    const status = getStatusForDate(date);
    return (
      {
        Sunday: "sunday",
        "On Time": "on-time",
        Late: "late",
        "Half Day": "half-day",
        Holiday: "holiday",
        "No Login": "no-login",
        "No Login (Today)": "no-login-today",
      }[status] || "no-attendance"
    );
  };

  const handleDateClick = (value) => {
    const dateStr = formatDate(value);
    const data = attendanceData.find((entry) => entry.date === dateStr);
    setSelectedDateData(
      data || {
        date: dateStr,
        loginTime: null,
        logoutTime: null,
        status: getStatusForDate(new Date(dateStr)),
      }
    );
  };

  return (
    <div className="p-4 attendance-wrapper">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Attendance Calendar
      </h2>

      <div className="calendar-container">
        <Calendar
          onClickDay={handleDateClick}
          tileClassName={getTileClassName}
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-4 justify-center">
        <Legend color="bg-green-300" label="On Time" />
        <Legend color="bg-orange-300" label="Late" />
        <Legend color="bg-pink-300" label="Half Day" />
        <Legend color="bg-gray-300" label="Holiday" />
        <Legend color="bg-blue-300" label="Sunday" />
        <Legend color="border-2 border-gray-300" label="No Login" />
        <Legend color="border-2 border-red-500" label="No Login (Today)" />
      </div>

      {selectedDateData ? (
        <div className="mt-4 p-4 border rounded shadow bg-white max-w-md mx-auto">
          <h3 className="text-lg font-semibold">
            Details for {selectedDateData.date}
          </h3>
          <p>Login: {selectedDateData.loginTime || "—"}</p>
          <p>Logout: {selectedDateData.logoutTime || "—"}</p>
          <p>Status: {selectedDateData.status}</p>
        </div>
      ) : (
        <p className="mt-4 text-gray-600 text-center">
          Click on a date to see details.
        </p>
      )}
    </div>
  );
};

const Legend = ({ color, label }) => (
  <div className="flex items-center space-x-2">
    <div className={`w-4 h-4 rounded ${color}`}></div>
    <span className="text-sm">{label}</span>
  </div>
);

export default AttendanceCalendar;
