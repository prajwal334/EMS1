// src/components/tasks/TasksSection.jsx

import React, { useEffect, useState } from "react";
import QueryModal from "../modal/QueryModal";
import TimeModal from "../modal/TimeModal";
import DoneModal from "../modal/DoneModal";
import ViewModal from "../modal/ViewModal";

const ItTasksSection = ({ userDesignation, userId }) => {
  
  const [tasks, setTasks] = useState([]);

  // Query modal states
  const [isQueryModalOpen, setIsQueryModalOpen] = useState(false);
  const [currentQueryTaskId, setCurrentQueryTaskId] = useState(null);
  const [queryText, setQueryText] = useState("");

  // Time modal states
  const [isTimeModalOpen, setIsTimeModalOpen] = useState(false);
  const [currentTimeTaskId, setCurrentTimeTaskId] = useState(null);
  const [timeReason, setTimeReason] = useState("");

  // Done modal states
  const [isDoneModalOpen, setIsDoneModalOpen] = useState(false);
  const [currentDoneTaskId, setCurrentDoneTaskId] = useState(null);
  const [doneMessage, setDoneMessage] = useState("");
  const [doneImage, setDoneImage] = useState(null);
  const [doneImagePreview, setDoneImagePreview] = useState(null);

  // View modal state
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentViewTaskId, setCurrentViewTaskId] = useState(null);

  // Fetch tasks for user
  useEffect(() => {
    const fetchTasksForUser = async () => {
      if (!userId) return;
      try {
        const token = localStorage.getItem("token");
        // Fetch employee info by userId
        const empRes = await fetch(
          `http://localhost:3000/api/employee/user/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!empRes.ok) throw new Error("Failed to fetch employee data");
        const empData = await empRes.json();
        const userEmp = empData.employees?.[0];
        if (!userEmp?.name) return;

        // Fetch tasks by employee name
        const taskRes = await fetch(
          `http://localhost:3000/api/task/employee/${userEmp.name}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!taskRes.ok) throw new Error("Failed to fetch tasks");
        const taskData = await taskRes.json();
        setTasks(taskData.tasks || []);
      } catch (err) {
        console.error("Failed to fetch tasks:", err);
      }
    };

    fetchTasksForUser();
  }, [userId]);

  // Handlers for Done modal image preview and submission
  const handleDoneImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setDoneImage(file);

    const reader = new FileReader();
    reader.onloadend = () => setDoneImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleDoneUpdate = async () => {
    if (!currentDoneTaskId) return;
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("update", doneMessage);
      if (doneImage) formData.append("update_image", doneImage);

      const response = await fetch(
        `http://localhost:3000/api/task/${currentDoneTaskId}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        alert("Failed to update task: " + (errorData.message || ""));
        return;
      }
      const data = await response.json();
      alert("Task updated successfully.");
      setIsDoneModalOpen(false);
      setDoneMessage("");
      setDoneImage(null);
      setDoneImagePreview(null);

      setTasks((prev) =>
        prev.map((t) =>
          t._id === currentDoneTaskId
            ? {
                ...t,
                update: doneMessage,
                update_image: data.update_image || t.update_image,
              }
            : t
        )
      );
    } catch (err) {
      console.error("Update error:", err);
      alert("An error occurred while updating the task.");
    }
  };

  // Handler for Time extension modal submission
  const handleTimeUpdate = async (taskId, selectedDate, reason) => {
    if (!taskId || !reason.trim()) {
      alert("Please provide a reason.");
      return;
    }
    try {
      let startDate, endDate;
      if (Array.isArray(selectedDate)) {
        startDate = selectedDate[0]?.toISOString() || null;
        endDate = selectedDate[1]?.toISOString() || null;
      } else {
        startDate = selectedDate?.toISOString() || null;
        endDate = selectedDate?.toISOString() || null;
      }

      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3000/api/task/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reason, startDate, endDate }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        alert("Failed to request time extension: " + (errorData.message || ""));
        return;
      }

      alert("Time extension request submitted.");
      setIsTimeModalOpen(false);
      setTimeReason("");
    } catch (err) {
      console.error("Time extension error:", err);
      alert("An error occurred while submitting the request.");
    }
  };

  return (
    <div>
      {/* Removed sub-department select control */}

      {/* Removed employees list */}

      {/* Show Tasks as cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tasks.map((task, idx) => (
          <li
            key={task._id || idx}
            className="bg-gray-200 p-4 rounded-lg shadow-md w-60 flex flex-col"
            style={{ height: "220px" }}
          >
            {/* First row: title + end date */}
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

            {/* Second row: message */}
            <p className="text-sm text-gray-700 mb-4 text-center overflow-y-auto h-24 bg-gray-50 p-2 rounded flex-grow">
              {task.message || "No description provided."}
            </p>

            {/* Third row: action icons */}
            <div className="flex justify-between items-center mt-auto">
              {/* View button */}
              <button
                type="button"
                title="View"
                onClick={() => {
                  setCurrentViewTaskId(task._id);
                  setIsViewModalOpen(true);
                }}
                className="text-gray-600 hover:text-blue-500 transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </button>

              <div className="flex space-x-3">
                {/* Query icon */}
                <button
                  type="button"
                  title="Query"
                  onClick={() => {
                    setCurrentQueryTaskId(task._id);
                    setIsQueryModalOpen(true);
                  }}
                  className="text-gray-600 hover:text-yellow-500 transition"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </button>

                {/* Time icon */}
                <button
                  type="button"
                  title="Request Time Extension"
                  onClick={() => {
                    setCurrentTimeTaskId(task._id);
                    setIsTimeModalOpen(true);
                  }}
                  className="text-gray-600 hover:text-green-500 transition"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </button>

                {/* Done icon */}
                <button
                  title="Mark Done"
                  onClick={() => {
                    setCurrentDoneTaskId(task._id);
                    setDoneMessage(task.update || "");
                    setDoneImagePreview(task.update_image || null);
                    setDoneImage(null);
                    setIsDoneModalOpen(true);
                  }}
                  className="text-gray-600 hover:text-green-500 transition"
                >
                  ✔️
                </button>
              </div>
            </div>
          </li>
        ))}
      </div>

      {/* QUERY MODAL */}
      <QueryModal
        isOpen={isQueryModalOpen}
        onClose={() => setIsQueryModalOpen(false)}
        queryText={queryText}
        setQueryText={setQueryText}
        onSend={async () => {
          if (!currentQueryTaskId) return;
          try {
            const token = localStorage.getItem("token");
            const response = await fetch(
              `http://localhost:3000/api/task/${currentQueryTaskId}`,
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ query: queryText }),
              }
            );
            if (!response.ok) {
              const errorData = await response.json();
              alert("Failed to send query: " + (errorData.message || ""));
              return;
            }
            await response.json();
            alert("Query sent successfully.");
            setIsQueryModalOpen(false);
            setQueryText("");
          } catch (err) {
            console.error("Fetch error:", err);
            alert("An error occurred while sending the query.");
          }
        }}
      />

      {/* TIME EXTENSION MODAL */}
      <TimeModal
        isOpen={isTimeModalOpen}
        onClose={() => {
          setIsTimeModalOpen(false);
          setTimeReason("");
        }}
        task={tasks.find((t) => t._id === currentTimeTaskId)}
        timeReason={timeReason}
        setTimeReason={setTimeReason}
        onSubmit={(selectedDate) => {
          handleTimeUpdate(currentTimeTaskId, selectedDate, timeReason);
        }}
      />

      {/* DONE MODAL */}
      <DoneModal
        isOpen={isDoneModalOpen}
        onClose={() => setIsDoneModalOpen(false)}
        doneMessage={doneMessage}
        setDoneMessage={setDoneMessage}
        doneImagePreview={doneImagePreview}
        handleDoneImageChange={handleDoneImageChange}
        onSubmit={handleDoneUpdate}
      />

      {/* VIEW MODAL */}
      <ViewModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        task={tasks.find((task) => task._id === currentViewTaskId)}
      />
    </div>
  );
};

export default ItTasksSection;
