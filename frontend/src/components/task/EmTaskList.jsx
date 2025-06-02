import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import {
  FiEye,
  FiMessageSquare,
  FiClock,
  FiCheckCircle
} from "react-icons/fi";

import { useAuth } from "../../context/authContext";
import QueryModal from "../../components/modal/QueryModal";
import TimeModal from "../../components/modal/TimeModal";
import DoneModal from "../../components/modal/DoneModal";
import ViewModal from "../../components/modal/ViewModal";

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

  const handleTimeUpdate = () => {
    alert(
      `Time update for task ${currentTimeTaskId} on ${selectedDate.toLocaleDateString()}:\n${timeReason}`
    );
    setIsTimeModalOpen(false);
    setTimeReason("");
    setSelectedDate(new Date());
  };

  const handleDoneImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setDoneImage(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setDoneImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDoneUpdate = () => {
    alert(
      `Done update for task ${currentDoneTaskId}:\nMessage: ${doneMessage}\nImage: ${
        doneImage ? doneImage.name : "No image"
      }`
    );
    setIsDoneModalOpen(false);
    setDoneMessage("");
    setDoneImage(null);
    setDoneImagePreview(null);
  };

  const isAnyModalOpen =
    isQueryModalOpen || isTimeModalOpen || isDoneModalOpen || isViewModalOpen;

  return (
    <div className="w-full px-4 md:px-10 py-10 relative">
      {/* Department Header */}
      <div className="w-full mb-8">
        <div className="w-full bg-red-200 rounded-xl shadow-xl p-5 text-center text-2xl font-bold text-gray-800">
          {department?.dep_name || "Department"}
        </div>
      </div>

      {/* SubDepartments */}
<div className="flex flex-wrap justify-center gap-4 mb-8">
  {subDepartments.map((sub) => {
    const isActive = userDesignation === sub.name;
    const isSelected = selectedSubDep === sub._id;

    return (
      <div
        key={sub._id}
        onClick={() => isActive && setSelectedSubDep(sub._id)}
        className={`w-36 px-4 py-3 text-center rounded-lg text-sm font-bold shadow-lg transition
          ${
            isActive
              ? "bg-blue-500 text-white cursor-pointer hover:bg-blue-600"
              : "bg-gray-200 text-gray-600 cursor-not-allowed"
          }
          ${isSelected ? "ring-2 ring-offset-2 ring-blue-300" : ""}
        `}
      >
        {sub.name}
      </div>
    );
  })}
</div>


      {/* Team Members */}
      {employees.length > 0 && (
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {employees.map((emp) => (
            <div
              key={emp._id || emp}
              className="bg-white p-3 rounded-lg shadow hover:shadow-lg text-center"
            >
              <p>{emp.name || emp.userName || "Unnamed User"}</p>
            </div>
          ))}
        </div>
      )}

      {/* Task Cards */}
<div
  className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 transition-all duration-300 ${
    isAnyModalOpen ? "blur-sm pointer-events-none select-none" : ""
  }`}
>
  {tasks.map((task, index) => (
    <div
      key={task._id || index}
      className="bg-white rounded-2xl p-6 shadow-2xl w-80 h-[320px] flex flex-col justify-between transition hover:shadow-3xl"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-semibold text-lg text-gray-800 truncate">
          {task.task_title || "Untitled Task"}
        </h4>
        <span className="text-xs text-gray-500">
          {task.endDate
            ? new Date(task.endDate).toLocaleDateString()
            : "No Date"}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-700 mb-4 flex-grow bg-gray-50 p-2 rounded overflow-y-auto">
        {task.message || "No description"}
      </p>

      {/* Actions */}
      <div className="flex justify-between items-center mt-2">
        {/* View Icon */}
        <button
          title="View"
          onClick={() => {
            setCurrentViewTaskId(task._id);
            setIsViewModalOpen(true);
          }}
          className="text-black hover:text-gray-700"
        >
          <FiEye size={20} />
        </button>

        {/* Right-side icons */}
        <div className="flex gap-4">
          <button
            title="Query"
            onClick={() => {
              setCurrentQueryTaskId(task._id);
              setQueryText("");
              setIsQueryModalOpen(true);
            }}
            className="text-black hover:text-gray-700"
          >
            <FiMessageSquare size={20} />
          </button>

          <button
            title="Extend Time"
            onClick={() => {
              setCurrentTimeTaskId(task._id);
              setSelectedDate(new Date());
              setTimeReason("");
              setIsTimeModalOpen(true);
            }}
            className="text-black hover:text-gray-700"
          >
            <FiClock size={20} />
          </button>

          <button
            title="Mark Done"
            onClick={() => {
              setCurrentDoneTaskId(task._id);
              setDoneMessage("");
              setDoneImage(null);
              setDoneImagePreview(null);
              setIsDoneModalOpen(true);
            }}
            className="text-black hover:text-gray-700"
          >
            <FiCheckCircle size={20} />
          </button>
        </div>
      </div>
    </div>
  ))}
</div>


      {/* Modals */}
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
          const token = localStorage.getItem("token");
          try {
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

            if (!response.ok) throw new Error("Failed to send query");

            alert("Query sent successfully.");
            setIsQueryModalOpen(false);
            setQueryText("");
          } catch (err) {
            alert("Error sending query");
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
