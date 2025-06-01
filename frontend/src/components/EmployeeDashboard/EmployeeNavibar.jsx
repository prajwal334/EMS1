import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/authContext";
import { FaUserCircle, FaCalendarAlt, FaCog } from "react-icons/fa";

const attendanceColors = {
  onTime: "bg-green-600",
  halfDay: "bg-pink-500",
  absent: "bg-red-600",
  late: "bg-orange-500",
};

const getWeekday = (date) =>
  date.toLocaleDateString("en-US", { weekday: "short" });

const EmployeeNavbar = () => {
  const { user } = useAuth();
  const [currentMonth, setCurrentMonth] = useState("");
  const [dates, setDates] = useState([]);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    const now = new Date();
    setCurrentMonth(now.toLocaleString("default", { month: "long" }));

    const prev = new Date(now);
    prev.setDate(now.getDate() - 1);

    const next = new Date(now);
    next.setDate(now.getDate() + 1);

    setDates([
      { date: prev, status: "onTime" },
      { date: now, status: "absent" },
      { date: next, status: "late" },
    ]);
  }, []);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="relative w-64 bg-green-100 rounded-2xl p-4 shadow-md text-center">
      {/* Blurred overlay */}
      {settingsOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={() => setSettingsOpen(false)}
        />
      )}

      {/* Profile Image */}
      <div className="relative mx-auto w-24 h-24 mb-4 rounded-full shadow-lg overflow-hidden">
        {user.profilePic ? (
          <img
            src={user.profilePic}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <FaUserCircle className="w-full h-full text-gray-400" />
        )}
      </div>

      <h3 className="text-lg font-bold text-gray-800">{user.name}</h3>
      <a href="/profile" className="text-sm text-blue-600 hover:underline">
        View Profile
      </a>

      {/* Calendar */}
      <div className="mt-6 mb-4 text-left">
        <div className="flex items-center justify-between bg-white p-2 rounded-md shadow-sm">
          <p className="text-gray-800 font-semibold">Calendar</p>
          <div className="flex items-center gap-2">
            <span className="text-gray-800 font-medium">{currentMonth}</span>
            <FaCalendarAlt className="text-gray-500" />
          </div>
        </div>
      </div>

      {/* Day Cards */}
     <div className="flex flex-col items-center gap-8 mt-6 mb-6">
  {dates.map(({ date, status }, index) => (
    <div
      key={index}
      className="flex flex-col items-center justify-center bg-blue-100 w-20 h-20 rounded-xl"
      style={{
        boxShadow: "0 10px 15px rgba(0, 0, 0, 0.3)", // Strong 3D shadow below
      }}
    >
      <span className="text-xl font-extrabold text-gray-900">
        {date.getDate()}
      </span>
      <span className="text-sm text-gray-700">{getWeekday(date)}</span>
      <span
        className={`mt-2 w-3 h-3 rounded-full ${attendanceColors[status]}`}
      ></span>
    </div>
  ))}
</div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm text-gray-700 mb-12">
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-green-600"></span> On Time
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-pink-500"></span> Half Day
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-red-600"></span> Absent
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-orange-500"></span> Late
        </div>
      </div>

      {/* Settings Button */}
      <div className="absolute bottom-4 right-4 z-50">
        <button
          onClick={() => setSettingsOpen(!settingsOpen)}
          className={`w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center transition-transform duration-300 ${
            settingsOpen ? "rotate-90" : ""
          }`}
        >
          <FaCog className="text-gray-700 text-lg" />
        </button>

        {/* Settings Menu */}
        {settingsOpen && (
          <div className="absolute bottom-14 right-0 bg-white shadow-xl rounded-md py-2 px-4 text-left z-50">
            <button
              onClick={() => {
                setSettingsOpen(false);
                // Handle route or modal open for password change
                alert("Change Password clicked");
              }}
              className="text-sm text-gray-800 hover:text-blue-600 transition"
            >
              Change Password
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeNavbar;
