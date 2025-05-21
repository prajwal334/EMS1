import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import axios from "axios";
import dayjs from "dayjs";
import { useParams } from "react-router-dom";
import "react-calendar/dist/Calendar.css";

// Legend component
const Legend = ({ color, label }) => (
  <div className="flex items-center space-x-2">
    <div className={`w-4 h-4 rounded ${color}`}></div>
    <span className="text-sm">{label}</span>
  </div>
);

const AttendanceEditView = ({ userId }) => {
  const [attendance, setAttendance] = useState([]);
  const [selectedDateData, setSelectedDateData] = useState(null);
  const [userDetails, setUserDetails] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [message, setMessage] = useState(""); // ✅ message text
  const [messageType, setMessageType] = useState(""); // ✅ 'success' or 'error'

  useEffect(() => {
    if (!userId) return;

    setLoading(true);
    setError(null);
    axios
      .get(`http://localhost:3000/api/attendance/${userId}`)
      .then((res) => {
        const data = res.data;
        const attendanceArray = Array.isArray(data.attendance)
          ? data.attendance
          : [];

        setAttendance(attendanceArray);

        const first = attendanceArray[0] || {};
        setUserDetails({
          name: first.username || "",
          department: first.department || "",
          employeeId: data.employeeId || first.userId || "",
        });
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch attendance data.");
      })
      .finally(() => setLoading(false));
  }, [userId]);

  const handleDateClick = (date) => {
    const clicked = dayjs(date).format("YYYY-MM-DD");
    const found = attendance.find(
      (a) => dayjs(a.date).format("YYYY-MM-DD") === clicked
    );

    setSelectedDateData(
      found ? { ...found, date: clicked } : { date: clicked }
    );
    setEditMode(false);
  };

  const getTileClassName = ({ date, view }) => {
    if (view !== "month") return "";

    const dateStr = dayjs(date).format("YYYY-MM-DD");
    const record = attendance.find(
      (a) => dayjs(a.date).format("YYYY-MM-DD") === dateStr
    );

    if (record) {
      const status = (record.status || "absent").toLowerCase();

      switch (status) {
        case "on time":
          return "on-time";
        case "late":
          return "late";
        case "half day":
          return "half-day";
        case "absent":
          return "absent";
        case "holiday":
          return "holiday";
        default:
          return "absent";
      }
    } else {
      if (dayjs(date).day() === 0) {
        return "sunday";
      } else {
        return "no-login";
      }
    }
  };

  const showMessage = (text, type) => {
    setMessage(text);
    setMessageType(type);

    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 3000); // auto-hide after 3s
  };

  const handleEditSave = () => {
    const payload = {
      userId,
      loginTime: selectedDateData.loginTime || "",
      logoutTime: selectedDateData.logoutTime || "",
      status: selectedDateData.status || "",
    };

    if (selectedDateData._id) {
      axios
        .put(
          `http://localhost:3000/api/attendance/edit/${selectedDateData._id}`,
          { ...payload, date: selectedDateData.date }
        )
        .then(() => {
          const updated = attendance.map((a) =>
            a._id === selectedDateData._id ? { ...a, ...selectedDateData } : a
          );
          setAttendance(updated);
          setEditMode(false);
          showMessage("Attendance updated successfully!", "success");
        })
        .catch((err) => {
          console.error(err);
          showMessage("Server error while updating attendance.", "error");
        });
    } else {
      axios
        .post(`http://localhost:3000/api/attendance/`, {
          ...payload,
          date: selectedDateData.date,
        })
        .then((res) => {
          const newEntry = res.data;
          setAttendance([...attendance, newEntry]);
          setSelectedDateData(newEntry);
          setEditMode(false);
          showMessage("Attendance saved successfully!", "success");
        })
        .catch((err) => {
          console.error(err);
          showMessage("Server error while saving attendance.", "error");
        });
    }
  };

  return (
    <div className="p-4 max-w-5xl mx-auto relative">
      {/* ✅ Message Toast */}
      {message && (
        <div
          className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded shadow-lg z-50 ${
            messageType === "success" ? "bg-green-500" : "bg-red-500"
          } text-white transition duration-300`}
        >
          {message}
        </div>
      )}

      {loading && <p className="text-center text-gray-600">Loading...</p>}
      {error && <p className="text-center text-red-600">{error}</p>}

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-6 border-b pb-3">
        <div className="flex flex-wrap gap-4 justify-between w-full">
          <p className="font-medium text-sm sm:text-base">
            <span className="font-semibold">Name:</span>{" "}
            {userDetails.name || "—"}
          </p>
          <p className="font-medium text-sm sm:text-base">
            <span className="font-semibold">Department:</span>{" "}
            {userDetails.department || "—"}
          </p>
          <p className="font-medium text-sm sm:text-base">
            <span className="font-semibold">Employee ID:</span>{" "}
            {userDetails.employeeId || userId || "—"}
          </p>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4 text-center">
        Attendance Calendar
      </h2>

      <div className="calendar-container mb-4 max-w-md mx-auto">
        <Calendar
          onClickDay={handleDateClick}
          tileClassName={getTileClassName}
        />
      </div>

      {!selectedDateData && (
        <p className="text-center text-gray-600 mb-4">
          <b>Click on a date to edit details.</b>
        </p>
      )}

      <div className="flex flex-wrap gap-4 justify-center mb-4">
        <Legend color="bg-green-300" label="On Time" />
        <Legend color="bg-orange-300" label="Late" />
        <Legend color="bg-pink-300" label="Half Day" />
        <Legend color="bg-gray-300" label="Holiday" />
        <Legend color="bg-blue-300" label="Sunday" />
        <Legend color="border-2 border-gray-300" label="No Login" />
        <Legend color="bg-red-600 text-white" label="Absent" />
      </div>

      {selectedDateData && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
            <button
              className="absolute top-2 right-3 text-gray-500 hover:text-black text-lg"
              onClick={() => {
                setSelectedDateData(null);
                setEditMode(false);
              }}
            >
              ×
            </button>
            <h3 className="text-lg font-semibold mb-2">
              {editMode ? "Edit Attendance" : "Attendance Details"} –{" "}
              {selectedDateData.date}
            </h3>

            {editMode ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm">Login Time:</label>
                  <input
                    type="time"
                    value={selectedDateData.loginTime || ""}
                    onChange={(e) =>
                      setSelectedDateData({
                        ...selectedDateData,
                        loginTime: e.target.value,
                      })
                    }
                    className="border p-1 w-full rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm">Logout Time:</label>
                  <input
                    type="time"
                    value={selectedDateData.logoutTime || ""}
                    onChange={(e) =>
                      setSelectedDateData({
                        ...selectedDateData,
                        logoutTime: e.target.value,
                      })
                    }
                    className="border p-1 w-full rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm">Status:</label>
                  <select
                    value={selectedDateData.status || ""}
                    onChange={(e) =>
                      setSelectedDateData({
                        ...selectedDateData,
                        status: e.target.value,
                      })
                    }
                    className="border p-1 w-full rounded"
                  >
                    <option value="">Select status</option>
                    <option value="On Time">On Time</option>
                    <option value="Late">Late</option>
                    <option value="Half Day">Half Day</option>
                    <option value="Holiday">Holiday</option>
                  </select>
                </div>
                <div className="flex justify-center mt-3">
                  <button
                    onClick={handleEditSave}
                    className="bg-green-600 text-white px-4 py-1 rounded"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <p>
                  <strong>Login:</strong> {selectedDateData.loginTime || "—"}
                </p>
                <p>
                  <strong>Logout:</strong> {selectedDateData.logoutTime || "—"}
                </p>
                <p>
                  <strong>Status:</strong> {selectedDateData.status || "—"}
                </p>
                <div className="flex justify-center mt-4">
                  <button
                    className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
                    onClick={() => setEditMode(true)}
                  >
                    Edit
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const AttendancePage = () => {
  const { userId } = useParams();
  return userId ? (
    <AttendanceEditView userId={userId} />
  ) : (
    <p>Please provide a userId in the URL.</p>
  );
};

export default AttendancePage;
