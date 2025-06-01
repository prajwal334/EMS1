import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import QueryModal from "../../components/modal/QueryModal";
import TimeModal from "../../components/modal/TimeModal";
import DoneModal from "../../components/modal/DoneModal";
import ViewModal from "../../components/modal/ViewModal";

import "react-calendar/dist/Calendar.css";
import Calendar from "react-calendar";
import "./task.css";

const EmTasklist = () => {
  const { id } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const role = queryParams.get("role");

  const { user } = useAuth();

  const [department, setDepartment] = useState(null);
  const [subDepartments, setSubDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSubDep, setSelectedSubDep] = useState("");
  const [userDesignation, setUserDesignation] = useState("");
  const [tasks, setTasks] = useState([]);

  // Modal states
  const [isQueryModalOpen, setIsQueryModalOpen] = useState(false);
  const [currentQueryTaskId, setCurrentQueryTaskId] = useState(null);
  const [queryText, setQueryText] = useState("");

  const [isTimeModalOpen, setIsTimeModalOpen] = useState(false);
  const [currentTimeTaskId, setCurrentTimeTaskId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [timeReason, setTimeReason] = useState("");

  const [isDoneModalOpen, setIsDoneModalOpen] = useState(false);
  const [currentDoneTaskId, setCurrentDoneTaskId] = useState(null);
  const [doneMessage, setDoneMessage] = useState("");
  const [doneImage, setDoneImage] = useState(null);
  const [doneImagePreview, setDoneImagePreview] = useState(null);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentViewTaskId, setCurrentViewTaskId] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const token = localStorage.getItem("token");

        const [depRes, subDepRes] = await Promise.all([
          fetch(`http://localhost:3000/api/department/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`http://localhost:3000/api/department/${id}/subdepartments`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const depData = await depRes.json();
        const subDepData = await subDepRes.json();

        setDepartment(depData.department);
        setSubDepartments(subDepData.subDepartments || []);

        if (user?._id) {
          const empRes = await fetch(
            `http://localhost:3000/api/employee/user/${user._id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          const empData = await empRes.json();
          const userEmp = empData.employees?.[0];
          setUserDesignation(userEmp?.designation || "");

          if (userEmp?.name) {
            const taskRes = await fetch(
              `http://localhost:3000/api/task/employee/${userEmp.name}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            const taskData = await taskRes.json();
            setTasks(taskData.tasks || []);
          }
        }
      } catch (error) {
        console.error("Failed to fetch details:", error);
        setError("Failed to load department details.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id, user]);

  useEffect(() => {
    const fetchTeamUsersByDesignation = async () => {
      if (!selectedSubDep || !role) return;

      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `http://localhost:3000/api/team/by-designation/${selectedSubDep}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();

        let users = [];
        if (role === "leader") {
          users = data.teams.map((team) => team.leaderUserId).filter(Boolean);
        } else if (role === "member") {
          users = data.teams.flatMap((team) => team.memberUserIds || []);
        }

        setEmployees(users);
      } catch (err) {
        console.error("Failed to fetch team users", err);
      }
    };

    fetchTeamUsersByDesignation();
  }, [selectedSubDep, role]);

  // Time modal update handler
  const handleTimeUpdate = () => {
    alert(
      `Time update for task ${currentTimeTaskId} on date ${selectedDate.toLocaleDateString()} with reason:\n${timeReason}`
    );
    setIsTimeModalOpen(false);
    setTimeReason("");
    setSelectedDate(new Date());
  };

  // Done modal image change handler
  const handleDoneImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setDoneImage(file);

    // Preview image
    const reader = new FileReader();
    reader.onloadend = () => {
      setDoneImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Done modal update handler
  const handleDoneUpdate = () => {
    // TODO: Implement API call for update with doneMessage and doneImage
    alert(
      `Done update for task ${currentDoneTaskId}:\nMessage: ${doneMessage}\nImage: ${
        doneImage ? doneImage.name : "No image"
      }`
    );
    // Reset modal state
    setIsDoneModalOpen(false);
    setDoneMessage("");
    setDoneImage(null);
    setDoneImagePreview(null);
  };

  return (
    <div className="w-full px-4 md:px-8 lg:px-16 py-8">
      {loading ? (
        <p className="text-center">Loading department details...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <>
          <div className="flex justify-center mb-6">
            <div className="bg-white rounded-lg shadow-md px-6 py-3 text-center w-64">
              <h2 className="text-lg font-semibold text-gray-800">
                {department?.dep_name || "Department"}
              </h2>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-4">
            {subDepartments.map((sub) => {
              const isActive = userDesignation === sub.name;
              const isSelected = selectedSubDep === sub._id;

              return (
                <div
                  key={sub._id}
                  className={`px-4 py-2 text-sm rounded-lg shadow transition-all duration-300
                  ${
                    isActive
                      ? "cursor-pointer hover:bg-blue-100"
                      : "cursor-not-allowed bg-gray-200"
                  }
                  ${isSelected ? "bg-blue-200 font-semibold" : "bg-white"}
                  `}
                  onClick={() => isActive && setSelectedSubDep(sub._id)}
                >
                  {sub.name}
                </div>
              );
            })}
          </div>

          <div className="mt-4">
            {employees.length > 0 && (
              <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {employees.map((emp) => (
                  <li
                    key={emp._id || emp}
                    className="bg-white p-4 rounded shadow hover:shadow-lg"
                  >
                    <p>{emp.name || emp.userName || "Unnamed User"}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 justify-center">
            {tasks.map((task, index) => (
              <li
                key={task._id || index}
                className="bg-gray-200 p-4 rounded-lg shadow-md w-60 flex flex-col"
                style={{ height: "220px" }}
              >
                {/* First row: task_title left, end_date right */}
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-md font-bold text-gray-800 truncate max-w-[70%]">
                    {task.task_title || "Untitled Task"}
                  </h4>
                  <span className="text-sm text-gray-500 whitespace-nowrap ml-2">
                    End Date:{" "}
                    {task.endDate
                      ? new Date(task.endDate).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>

                {/* Second row: centered message */}
                <p className="text-sm text-gray-700 mb-4 text-center overflow-y-auto h-24 bg-gray-50 p-2 rounded flex-grow">
                  {task.message || "No description provided."}
                </p>

                {/* Third row: right aligned icon buttons */}
                <div className="flex justify-between items-center mt-auto">
                  {/* View button on the left */}
                  <button
                    type="button"
                    title="View"
                    className="text-gray-600 hover:text-gray-800"
                    aria-label="View"
                    onClick={() => {
                      setCurrentViewTaskId(task._id);
                      setIsViewModalOpen(true);
                    }}
                  >
                    👁️
                  </button>

                  {/* Existing buttons aligned to the right */}
                  <div className="flex space-x-4">
                    {/* Query button */}
                    <button
                      type="button"
                      title="Queries"
                      className="text-blue-600 hover:text-blue-800"
                      aria-label="Queries"
                      onClick={() => {
                        setCurrentQueryTaskId(task._id);
                        setQueryText("");
                        setIsQueryModalOpen(true);
                      }}
                    >
                      💬
                    </button>

                    {/* Time button */}
                    <button
                      type="button"
                      title="Time"
                      className="text-yellow-600 hover:text-yellow-800"
                      aria-label="Time"
                      onClick={() => {
                        setCurrentTimeTaskId(task._id);
                        setSelectedDate(new Date());
                        setTimeReason("");
                        setIsTimeModalOpen(true);
                      }}
                    >
                      ⏰
                    </button>

                    {/* Done button */}
                    <button
                      type="button"
                      title="Done"
                      className="text-green-600 hover:text-green-800"
                      aria-label="Done"
                      onClick={() => {
                        setCurrentDoneTaskId(task._id);
                        setDoneMessage("");
                        setDoneImage(null);
                        setDoneImagePreview(null);
                        setIsDoneModalOpen(true);
                      }}
                    >
                      ✔️
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </div>
        </>
      )}

      <ViewModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        task={tasks.find((task) => task._id === currentViewTaskId)}
      />

      <QueryModal
        isOpen={isQueryModalOpen}
        onClose={() => setIsQueryModalOpen(false)}
        queryText={queryText}
        setQueryText={setQueryText}
        onSend={async () => {
          console.log("Sending query...");
          console.log("Task ID:", currentQueryTaskId);
          console.log("Query Text:", queryText);

          const token = localStorage.getItem("token");
          const url = `http://localhost:3000/api/task/${currentQueryTaskId}`;
          console.log("API URL:", url);

          try {
            const response = await fetch(url, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ query: queryText }),
            });

            if (!response.ok) {
              const errorData = await response.json();
              console.error("Error response:", errorData);
              alert(
                "Failed to send query: " +
                  (errorData.message || "Unknown error")
              );
              return;
            }

            const data = await response.json();
            console.log("Success response:", data);
            alert("Query sent successfully.");
            setIsQueryModalOpen(false);
            setQueryText("");
          } catch (error) {
            console.error("Fetch error:", error);
            alert("An error occurred while sending the query.");
          }
        }}
      />

      <TimeModal
        isOpen={isTimeModalOpen}
        onClose={() => setIsTimeModalOpen(false)}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        timeReason={timeReason}
        setTimeReason={setTimeReason}
        onSubmit={handleTimeUpdate}
      />

      <DoneModal
        isOpen={isDoneModalOpen}
        onClose={() => setIsDoneModalOpen(false)}
        doneMessage={doneMessage}
        setDoneMessage={setDoneMessage}
        doneImagePreview={doneImagePreview}
        handleDoneImageChange={handleDoneImageChange}
        onSubmit={handleDoneUpdate}
      />
    </div>
  );
};

export default EmTasklist;
