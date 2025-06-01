import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./task.css";
import StatusTable from "./statusTable";

const Tasklist = () => {
  const { id } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const role = queryParams.get("role");

  const [department, setDepartment] = useState(null);
  const [subDepartments, setSubDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [selectedSubDep, setSelectedSubDep] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [taskTitle, setTaskTitle] = useState(""); // New: Task Title
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);
  const [dateRange, setDateRange] = useState([new Date(), new Date()]);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const token = localStorage.getItem("token");

        const depRes = await fetch(
          `http://localhost:3000/api/department/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const depData = await depRes.json();
        setDepartment(depData.department);

        const subRes = await fetch(
          `http://localhost:3000/api/department/${id}/subdepartments`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const subData = await subRes.json();
        setSubDepartments(subData.subDepartments || []);
      } catch (error) {
        console.error("Failed to fetch department or sub-departments", error);
        setError("Failed to load department details.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  useEffect(() => {
    const fetchTeamUsersByDesignation = async () => {
      if (!selectedSubDep || !role) return;
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `http://localhost:3000/api/team/by-designation/${selectedSubDep}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();

        let users = [];
        if (role === "leader") {
          users = data.teams.map((team) => team.leaderUserId).filter(Boolean);
        } else if (role === "employee") {
          users = data.teams.flatMap((team) => team.memberUserIds || []);
        }

        setEmployees(users);
      } catch (err) {
        console.error("Failed to fetch team users", err);
      }
    };

    fetchTeamUsersByDesignation();
  }, [selectedSubDep, role]);

  const handleTaskSubmit = async () => {
    if (
      !selectedSubDep ||
      !selectedEmployee ||
      !taskTitle ||
      !message ||
      !dateRange[0] ||
      !dateRange[1]
    ) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("subDepartment", selectedSubDep);

      const selectedEmpName =
        employees.find((emp) => emp._id === selectedEmployee)?.name || "";

      formData.append("employeeName", selectedEmpName);
      formData.append("employeeId", selectedEmployee);
      formData.append("task_title", taskTitle);
      formData.append("message", message);
      if (image) formData.append("image", image);
      formData.append("startDate", dateRange[0].toISOString());
      formData.append("endDate", dateRange[1].toISOString());

      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:3000/api/task/assign", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to assign task");

      alert("Task assigned successfully!");
      setShowModal(false);
      setSelectedSubDep("");
      setSelectedEmployee("");
      setTaskTitle("");
      setMessage("");
      setImage(null);
      setDateRange([new Date(), new Date()]);
    } catch (err) {
      console.error(err);
      alert("Error assigning task.");
    }
  };

  return (
    <div className="w-full px-4 md:px-8 lg:px-16 py-8">
      {loading ? (
        <p className="text-center">Loading department details...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <>
          <div className="flex justify-center mb-6 relative">
            <div className="bg-white rounded-lg shadow-md px-4 py-2 text-center w-64">
              <h2 className="text-lg font-semibold text-gray-800">
                {department?.dep_name}
              </h2>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-4">
            {subDepartments.length === 0 ? (
              <p className="text-gray-600">No sub-departments found.</p>
            ) : (
              subDepartments.map((sub) => (
                <div
                  key={sub._id}
                  className={`bg-white px-4 py-2 text-sm rounded-lg shadow text-gray-800 cursor-pointer hover:bg-blue-100 hover:scale-105 hover:shadow-lg transition-all duration-300 transform ${
                    selectedSubDep === sub._id ? "bg-blue-200" : ""
                  }`}
                  onClick={() => {
                    setSelectedSubDep(sub._id);
                    setSelectedEmployee("");
                  }}
                >
                  {sub.name}
                </div>
              ))
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => setShowModal(true)}
              className="absolute top-[10px] right-[10px] text-2xl text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-full shadow-md"
              title="Create Task"
            >
              +
            </button>
          </div>

          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg w-full max-w-2xl p-6 space-y-4 relative max-h-[90vh] overflow-y-auto">
                <button
                  onClick={() => setShowModal(false)}
                  className="absolute top-3 right-3 text-gray-600 hover:text-red-500 text-xl font-bold"
                  aria-label="Close"
                >
                  ×
                </button>

                <h3 className="text-xl font-semibold text-center">
                  Create Task
                </h3>

                {/* Sub-department and employee select */}
                <div className="flex justify-between gap-4">
                  <div className="w-1/2">
                    <label className="block mb-1 text-sm font-medium">
                      Sub-department
                    </label>
                    <select
                      className="w-full border border-gray-300 rounded px-3 py-2"
                      value={selectedSubDep}
                      onChange={(e) => {
                        setSelectedSubDep(e.target.value);
                        setSelectedEmployee("");
                      }}
                    >
                      <option value="">Select Sub-department</option>
                      {subDepartments.map((sub) => (
                        <option key={sub._id} value={sub._id}>
                          {sub.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="w-1/2">
                    <label className="block mb-1 text-sm font-medium">
                      Select Employee
                    </label>
                    <select
                      className="w-full border border-gray-300 rounded px-3 py-2"
                      value={selectedEmployee}
                      onChange={(e) => setSelectedEmployee(e.target.value)}
                    >
                      <option value="">Select Employee</option>
                      {employees.map((emp) => (
                        <option key={emp._id} value={emp._id}>
                          {emp.name || emp.userId?.name || "Unnamed"}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Task Title */}
                <div>
                  <label className="block mb-1 text-sm font-medium">
                    Task Title
                  </label>
                  <input
                    type="text"
                    maxLength={200}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    placeholder="Enter task title (max 200 characters)"
                  />
                  <div className="text-sm text-gray-500 text-right">
                    {taskTitle.length} / 200
                  </div>
                </div>

                {/* Task Message */}
                <div>
                  <label className="block mb-1 text-sm font-medium">
                    Task Message
                  </label>
                  <textarea
                    rows="4"
                    maxLength={1000}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter task description (max 1000 characters)"
                  />
                  <div className="text-sm text-gray-500 text-right">
                    {message.length} / 1000
                  </div>
                </div>

                {/* Date Range Calendar */}
                <div className="flex justify-center">
                  <Calendar
                    selectRange={true}
                    onChange={setDateRange}
                    value={dateRange}
                    className="react-calendar"
                  />
                </div>
                {Array.isArray(dateRange) && (
                  <div className="text-sm text-gray-700 mt-2 text-center">
                    Selected: {dateRange[0].toLocaleDateString()} →{" "}
                    {dateRange[1]?.toLocaleDateString()}
                  </div>
                )}

                {/* Image Upload and Submit */}
                <div className="flex justify-between items-center gap-4">
                  <div className="w-1/2">
                    <label className="block mb-1 text-sm font-medium">
                      Upload Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImage(e.target.files[0])}
                    />
                  </div>
                  <div className="w-1/2 flex justify-end">
                    <button
                      onClick={handleTaskSubmit}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                      Assign Task
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
      <br />
      <br />
      <StatusTable />
    </div>
  );
};

export default Tasklist;
