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
  const [departmentName, setDepartmentName] = useState("");

  const holidayDates = [
    // Add holiday dates here, e.g., "2025-01-01", "2025-05-01"
  ];

  const departmentTimingRules = {
    marketing: {
      loginTimeLimit: 9 * 60,
      lateLoginLimit: 10 * 60,
      halfDayLoginLimit: 12 * 60,
      logoutLimit: 18 * 60,
    },
    it: {
      loginTimeLimit: 21 * 60,
      lateLoginLimit: 21 * 60 + 4,
      halfDayLoginLimit: 24 * 60,
      logoutLimit: 6 * 60,
      isNightShift: true,
    },
    hr: {
      loginTimeLimit: 5 * 60,
      lateLoginLimit: 6 * 60,
      halfDayLoginLimit: 8 * 60,
      logoutLimit: 10 * 60,
    },
    sales: {
      loginTimeLimit: 11 * 60,
      lateLoginLimit: 12 * 60,
      halfDayLoginLimit: 13 * 60,
      logoutLimit: 20 * 60,
    },
  };

  const formatDate = (date) => date.toLocaleDateString("en-CA");

  // Helper: check if date is today
  const isToday = (someDate) => {
    const today = new Date();
    return (
      someDate.getDate() === today.getDate() &&
      someDate.getMonth() === today.getMonth() &&
      someDate.getFullYear() === today.getFullYear()
    );
  };

  // Calculate status for a given login time & date
  const getStatusForDate = (date) => {
    const dateStr = formatDate(date);

    if (date.getDay() === 0) return "Sunday";
    if (holidayDates.includes(dateStr)) return "Holiday";

    const record = attendanceData.find((entry) => entry.date === dateStr);
    if (!record || !record.loginTime) {
      if (isToday(date)) return "No Login (Today)";
      return "No Login";
    }

    const [loginHour, loginMinute] = record.loginTime.split(":").map(Number);
    const loginInMinutes = loginHour * 60 + loginMinute;

    const [logoutHour, logoutMinute] = record.logoutTime
      ? record.logoutTime.split(":").map(Number)
      : [null, null];
    const logoutInMinutes =
      logoutHour !== null ? logoutHour * 60 + logoutMinute : null;

    const rules =
      departmentTimingRules[departmentName] ||
      departmentTimingRules["marketing"];

    // If user logged in and logged out properly
    if (loginInMinutes <= rules.loginTimeLimit) {
      return "On Time";
    } else if (loginInMinutes <= rules.lateLoginLimit) {
      return "Late";
    } else if (loginInMinutes <= rules.halfDayLoginLimit) {
      return "Half Day";
    } else if (logoutInMinutes !== null) {
      // Late login but logout exists — so don't mark "No Login"
      return "Half Day";
    } else {
      if (isToday(date)) return "No Login (Today)";
      return "No Login";
    }
  };

  const fetchAttendance = async () => {
    try {
      const [deptRes, loginRes] = await Promise.all([
        axios.get(
          `http://localhost:3000/api/employee/get-department/${user._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        ),
        axios.get(`http://localhost:3000/api/login-history/${user._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const dep_name = deptRes?.data?.department?.dep_name
        ?.trim()
        .toLowerCase();
      setDepartmentName(dep_name);

      const dailyData = {};

      loginRes.data.forEach((entry) => {
        const loginDate = new Date(entry.loginAt);
        const logoutDate = entry.logoutAt ? new Date(entry.logoutAt) : null;

        const dateStr = formatDate(loginDate);

        if (!dailyData[dateStr]) {
          dailyData[dateStr] = {
            loginAt: loginDate,
            logoutAt: null,
          };
        } else if (loginDate < dailyData[dateStr].loginAt) {
          dailyData[dateStr].loginAt = loginDate;
        }

        if (logoutDate) {
          if (
            !dailyData[dateStr].logoutAt ||
            logoutDate > dailyData[dateStr].logoutAt
          ) {
            dailyData[dateStr].logoutAt = logoutDate;
          }
        }
      });

      let formatted = Object.entries(dailyData).map(
        ([date, { loginAt, logoutAt }]) => ({
          date,
          loginTime: loginAt.toTimeString().slice(0, 5),
          logoutTime: logoutAt ? logoutAt.toTimeString().slice(0, 5) : null,
          loginTimeAMPM: loginAt.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          logoutTimeAMPM: logoutAt
            ? logoutAt.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })
            : null,
        })
      );

      // Add today dynamically if missing
      const todayStr = formatDate(new Date());
      const hasToday = formatted.some((item) => item.date === todayStr);

      if (!hasToday) {
        // Check if user logged in today using latest login history data
        const todayLogins = loginRes.data.filter(
          (entry) => formatDate(new Date(entry.loginAt)) === todayStr
        );
        if (todayLogins.length > 0) {
          const earliestLogin = todayLogins.reduce((earliest, current) =>
            new Date(current.loginAt) < new Date(earliest.loginAt)
              ? current
              : earliest
          );
          const loginDate = new Date(earliestLogin.loginAt);
          formatted.push({
            date: todayStr,
            loginTime: loginDate.toTimeString().slice(0, 5),
            logoutTime: null,
            loginTimeAMPM: loginDate.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            logoutTimeAMPM: null,
          });
        }
      }

      setAttendanceData(formatted);
    } catch (err) {
      console.error("Error fetching attendance/department:", err);
    }
  };

  useEffect(() => {
    if (user?._id) fetchAttendance();
  }, [user]);

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
        loginTimeAMPM: null,
        logoutTimeAMPM: null,
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
          <p>Login: {selectedDateData.loginTimeAMPM || "—"}</p>
          <p>Logout: {selectedDateData.logoutTimeAMPM || "—"}</p>
          <p>Status: {getStatusForDate(new Date(selectedDateData.date))}</p>
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
  <div className="flex items-center gap-2">
    <span className={`w-4 h-4 rounded-full inline-block ${color}`}></span>
    {label}
  </div>
);

export default AttendanceCalendar;
