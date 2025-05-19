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

  const holidayDates = []; // If dynamic, fetch in useEffect

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

  const isToday = (date) => {
    const today = new Date();
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  };

  const getStatusForDate = (date) => {
    const dateStr = formatDate(date);

    if (date.getDay() === 0) return "Sunday";
    if (holidayDates.includes(dateStr)) return "Holiday";

    const record = attendanceData.find((entry) => entry.date === dateStr);
    if (!record || !record.loginTime) {
      return isToday(date) ? "No Login (Today)" : "No Login";
    }

    const rules =
      departmentTimingRules[departmentName] ||
      departmentTimingRules["marketing"];

    const [loginHour, loginMinute] = record.loginTime.split(":").map(Number);
    let loginInMinutes = loginHour * 60 + loginMinute;

    let logoutInMinutes = null;
    if (record.logoutTime) {
      const [logoutHour, logoutMinute] = record.logoutTime
        .split(":")
        .map(Number);
      logoutInMinutes = logoutHour * 60 + logoutMinute;
      if (rules.isNightShift && logoutHour < 12) {
        logoutInMinutes += 24 * 60;
      }
    }

    if (loginInMinutes <= rules.loginTimeLimit) return "On Time";
    if (loginInMinutes <= rules.lateLoginLimit) return "Late";
    if (loginInMinutes <= rules.halfDayLoginLimit) return "Half Day";

    return logoutInMinutes !== null
      ? "Half Day"
      : isToday(date)
      ? "No Logout (Today)"
      : "No Login";
  };

  const fetchAttendance = async () => {
    try {
      if (!user?._id) return;

      const [deptRes, loginRes] = await Promise.all([
        axios.get(
          `http://localhost:3000/api/employee/get-department/${user._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        ),
        axios.get(`http://localhost:3000/api/login-history/${user._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const dep_name =
        deptRes?.data?.department?.dep_name?.trim().toLowerCase() ||
        "marketing";
      setDepartmentName(dep_name);

      const dailyData = {};

      loginRes.data.forEach((entry) => {
        const loginDate = new Date(entry.loginAt);
        const logoutDate = entry.logoutAt ? new Date(entry.logoutAt) : null;

        const loginDateStr = formatDate(loginDate);

        if (!dailyData[loginDateStr]) {
          dailyData[loginDateStr] = { loginAt: loginDate, logoutAt: null };
        } else if (loginDate < dailyData[loginDateStr].loginAt) {
          dailyData[loginDateStr].loginAt = loginDate;
        }

        if (logoutDate) {
          const logoutDateStr = formatDate(logoutDate);
          if (
            logoutDateStr === loginDateStr ||
            departmentTimingRules[dep_name]?.isNightShift
          ) {
            if (
              !dailyData[loginDateStr].logoutAt ||
              logoutDate > dailyData[loginDateStr].logoutAt
            ) {
              dailyData[loginDateStr].logoutAt = logoutDate;
            }
          }
        }
      });

      const formatted = Object.entries(dailyData).map(
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

      setAttendanceData(formatted);
    } catch (err) {
      console.error("Error fetching attendance/department:", err);
    }
  };

  useEffect(() => {
    fetchAttendance();
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
  <div className="flex items-center space-x-2">
    <div className={`w-4 h-4 rounded ${color}`}></div>
    <span className="text-sm">{label}</span>
  </div>
);

export default AttendanceCalendar;
