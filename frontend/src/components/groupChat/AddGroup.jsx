import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddGroup = () => {
  const [group, setGroup] = useState({
    group_name: "",
    group_dp: null,
    memberUserIds: [],
  });

  const [employees, setEmployees] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/employee", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setEmployees(res.data.employees || []);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchEmployees();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGroup({ ...group, [name]: value });
  };

  const handleFileChange = (e) => {
    setGroup({ ...group, group_dp: e.target.files[0] });
  };

  const handleMemberSelect = (e) => {
    const selected = e.target.value;
    if (selected && !group.memberUserIds.includes(selected)) {
      setGroup((prev) => ({
        ...prev,
        memberUserIds: [...prev.memberUserIds, selected],
      }));
    }
  };

  const handleRemoveMember = (id) => {
    setGroup((prev) => ({
      ...prev,
      memberUserIds: prev.memberUserIds.filter((uid) => uid !== id),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const formData = new FormData();
      formData.append("group_name", group.group_name);
group.memberUserIds.forEach((id) => formData.append("members", id));
      if (group.group_dp) {
        formData.append("group_dp", group.group_dp);
      }

      const res = await axios.post(
        "http://localhost:3000/api/group/add",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.data.success) {
        setSuccessMessage("✅ Group created successfully!");
        setTimeout(() => {
          navigate("/admin-dashboard/chat");
        }, 1500);
      }
    } catch (error) {
      const msg = error.response?.data?.error || "Something went wrong";
      setErrorMessage(`❌ ${msg}`);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-6">Add Group</h2>

      {errorMessage && (
        <div className="mb-4 text-red-600 bg-red-100 border border-red-300 p-3 rounded">
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className="mb-4 text-green-600 bg-green-100 border border-green-300 p-3 rounded">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Group Name */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700">Group Name</label>
          <input
            type="text"
            name="group_name"
            onChange={handleChange}
            placeholder="Enter Group Name"
            className="mt-1 w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Group DP */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700">Group Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-1 w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Members */}
        <div className="mb-6">
          <label className="text-sm font-medium text-gray-700">Add Members</label>
          <select
            name="memberUserIds"
            onChange={handleMemberSelect}
            value=""
            className="mt-1 w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="" disabled>
              Select a member to add
            </option>
            {employees
              .filter((emp) => !group.memberUserIds.includes(emp.userId._id))
              .map((emp) => (
                <option key={emp.userId._id} value={emp.userId._id}>
                  {emp.userId.name} ({emp.department?.dep_name || "No Dept"})
                </option>
              ))}
          </select>

          {/* Selected Members */}
          <div className="flex flex-wrap gap-2 mt-2">
            {group.memberUserIds.map((id) => {
              const member = employees.find((emp) => emp.userId._id === id);
              return (
                <span
                  key={id}
                  className="flex items-center bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full"
                >
                  ✔ {member?.userId.name} ({member?.department?.dep_name || "No Dept"})
                  <button
                    type="button"
                    onClick={() => handleRemoveMember(id)}
                    className="ml-2 text-red-500 hover:text-red-700 text-lg font-bold"
                    title="Remove Member"
                  >
                    ×
                  </button>
                </span>
              );
            })}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Create Group
        </button>
      </form>
    </div>
  );
};

export default AddGroup;
