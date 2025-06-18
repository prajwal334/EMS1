import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddTeam = () => {
  const [team, setTeam] = useState({
    team_name: "",
    departmentId: "",
<<<<<<< Updated upstream
    designation: "",
=======
>>>>>>> Stashed changes
    leaderUserId: "",
    memberUserIds: [],
    team_dp: null,
  });

  const [departments, setDepartments] = useState([]);
<<<<<<< Updated upstream
  const [subdepartments, setSubdepartments] = useState([]);
  const [leaders, setLeaders] = useState([]);
  const [members, setMembers] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
=======
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
>>>>>>> Stashed changes
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
<<<<<<< Updated upstream
    const fetchDepartments = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/department", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setDepartments(res.data.departments || []);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };
    fetchDepartments();
  }, []);

  useEffect(() => {
    const fetchRelatedData = async () => {
      if (!team.departmentId) {
        setSubdepartments([]);
        setLeaders([]);
        setMembers([]);
        return;
      }

      const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      };

      try {
        const subRes = await axios.get(
          `http://localhost:3000/api/department/${team.departmentId}/subdepartments`,
          { headers }
        );
        setSubdepartments(subRes.data.subDepartments || []);

        const [leaderRes, employeeRes] = await Promise.all([
          axios.get(
            `http://localhost:3000/api/employee/users/designations/${team.departmentId}?role=leader`,
            { headers }
          ),
          axios.get(
            `http://localhost:3000/api/employee/users/designations/${team.departmentId}?role=employee`,
            { headers }
          ),
        ]);

        const flattenUsers = (userMap) => Object.values(userMap || {}).flat();
        setLeaders(flattenUsers(leaderRes.data.designations));
        setMembers(flattenUsers(employeeRes.data.designations));
      } catch (error) {
        console.error("Error fetching related data:", error);
        setSubdepartments([]);
        setLeaders([]);
        setMembers([]);
      }

      setTeam((prev) => ({
        ...prev,
        leaderUserId: "",
        memberUserIds: [],
        designation: "",
      }));
    };

    fetchRelatedData();
  }, [team.departmentId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTeam((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setTeam((prev) => ({ ...prev, team_dp: file }));
    setPreviewImage(file ? URL.createObjectURL(file) : null);
  };

  const handleMemberSelect = (e) => {
    const selected = e.target.value;
    if (selected && !team.memberUserIds.includes(selected)) {
      setTeam((prev) => ({
        ...prev,
        memberUserIds: [...prev.memberUserIds, selected],
      }));
=======
    const fetchData = async () => {
      try {
        const [deptRes, empRes] = await Promise.all([
          axios.get("http://localhost:3000/api/department", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
          axios.get("http://localhost:3000/api/employee", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
        ]);

        setDepartments(deptRes.data.departments || []);
        setEmployees(empRes.data.employees || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (team.departmentId) {
      const filtered = employees
        .filter(
          (emp) => String(emp.department?._id) === String(team.departmentId)
        )
        .sort((a, b) => a.userId.name.localeCompare(b.userId.name));

      setFilteredEmployees(filtered);
    } else {
      setFilteredEmployees([]);
>>>>>>> Stashed changes
    }
  };

<<<<<<< Updated upstream
=======
    setTeam((prev) => ({ ...prev, leaderUserId: "", memberUserIds: [] }));
  }, [team.departmentId, employees]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTeam({ ...team, [name]: value });
  };

  const handleFileChange = (e) => {
    setTeam({ ...team, team_dp: e.target.files[0] });
  };

  const handleMemberSelect = (e) => {
    const selected = e.target.value;
    if (selected && !team.memberUserIds.includes(selected)) {
      setTeam((prev) => ({
        ...prev,
        memberUserIds: [...prev.memberUserIds, selected],
      }));
    }
  };

>>>>>>> Stashed changes
  const handleRemoveMember = (id) => {
    setTeam((prev) => ({
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
      formData.append("team_name", team.team_name);
      formData.append("departmentId", team.departmentId);
<<<<<<< Updated upstream

      // Convert designation ID to name
      const selectedDesignation = subdepartments.find(
        (sub) => sub._id === team.designation
      );
      const designationName = selectedDesignation
        ? selectedDesignation.name
        : team.designation;
      formData.append("designation", designationName);

      formData.append("leaderUserId", team.leaderUserId);
      team.memberUserIds.forEach((id) => formData.append("memberUserIds", id));
      if (team.team_dp) formData.append("team_dp", team.team_dp);
=======
      formData.append("leaderUserId", team.leaderUserId);
      team.memberUserIds.forEach((id) => formData.append("memberUserIds", id));
      if (team.team_dp) {
        formData.append("team_dp", team.team_dp);
      }
>>>>>>> Stashed changes

      const res = await axios.post(
        "http://localhost:3000/api/team/add",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data) {
        setSuccessMessage("✅ Team created successfully!");
        setTimeout(() => {
          navigate("/admin-dashboard/teams");
        }, 2000);
      }
    } catch (error) {
      const msg = error.response?.data?.error || "Something went wrong";
      if (msg.toLowerCase().includes("already exists")) {
        setErrorMessage("❌ Team with this name already exists.");
      } else {
        setErrorMessage(`❌ ${msg}`);
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-6">Add Team</h2>

      {errorMessage && (
<<<<<<< Updated upstream
        <div className="mb-4 text-red-700 bg-red-100 border border-red-300 p-3 rounded">
=======
        <div className="mb-4 text-red-600 bg-red-100 border border-red-300 p-3 rounded">
>>>>>>> Stashed changes
          {errorMessage}
        </div>
      )}

      {successMessage && (
<<<<<<< Updated upstream
        <div className="mb-4 text-green-700 bg-green-100 border border-green-300 p-3 rounded">
=======
        <div className="mb-4 text-green-600 bg-green-100 border border-green-300 p-3 rounded">
>>>>>>> Stashed changes
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
<<<<<<< Updated upstream
        {/* Team Name */}
=======
>>>>>>> Stashed changes
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700">Team Name</label>
          <input
            type="text"
            name="team_name"
<<<<<<< Updated upstream
            value={team.team_name}
=======
>>>>>>> Stashed changes
            onChange={handleChange}
            placeholder="Enter Team Name"
            className="mt-1 w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

<<<<<<< Updated upstream
        {/* Team Image */}
=======
>>>>>>> Stashed changes
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700">
            Team Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-1 w-full p-2 border border-gray-300 rounded-md"
          />
<<<<<<< Updated upstream
          {previewImage && (
            <img
              src={previewImage}
              alt="Preview"
              className="mt-2 h-20 w-20 object-cover rounded"
            />
          )}
        </div>

        {/* Department */}
=======
        </div>

>>>>>>> Stashed changes
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700">
            Department
          </label>
          <select
            name="departmentId"
            onChange={handleChange}
            value={team.departmentId}
            className="mt-1 w-full p-2 border border-gray-300 rounded-md"
            required
          >
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept._id} value={dept._id}>
                {dept.dep_name}
              </option>
            ))}
          </select>
        </div>

<<<<<<< Updated upstream
        {/* Subdepartment/Designation */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700">
            Sub-department (Designation)
          </label>
          <select
            name="designation"
            onChange={handleChange}
            value={team.designation}
            className="mt-1 w-full p-2 border border-gray-300 rounded-md"
            required
          >
            <option value="">Select Designation</option>
            {subdepartments.map((sub) => (
              <option key={sub._id} value={sub._id}>
                {sub.name}
              </option>
            ))}
          </select>
        </div>

        {/* Team Leader */}
=======
>>>>>>> Stashed changes
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700">
            Team Leader
          </label>
          <select
            name="leaderUserId"
            onChange={handleChange}
            value={team.leaderUserId}
            className="mt-1 w-full p-2 border border-gray-300 rounded-md"
            required
          >
            <option value="">Select Leader</option>
<<<<<<< Updated upstream
            {leaders.map((emp) => (
              <option key={emp._id} value={emp._id}>
                {emp.name}
=======
            {filteredEmployees.map((emp) => (
              <option key={emp.userId._id} value={emp.userId._id}>
                {emp.userId.name}
>>>>>>> Stashed changes
              </option>
            ))}
          </select>
        </div>

<<<<<<< Updated upstream
        {/* Members */}
=======
>>>>>>> Stashed changes
        <div className="mb-6">
          <label className="text-sm font-medium text-gray-700">
            Team Members
          </label>
          <select
<<<<<<< Updated upstream
=======
            name="memberUserIds"
>>>>>>> Stashed changes
            onChange={handleMemberSelect}
            value=""
            className="mt-1 w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="" disabled>
              Select a member to add
            </option>
<<<<<<< Updated upstream
            {members
              .filter((emp) => !team.memberUserIds.includes(emp._id))
              .map((emp) => (
                <option key={emp._id} value={emp._id}>
                  {emp.name}
=======
            {filteredEmployees
              .filter((emp) => !team.memberUserIds.includes(emp.userId._id))
              .map((emp) => (
                <option key={emp.userId._id} value={emp.userId._id}>
                  {emp.userId.name}
>>>>>>> Stashed changes
                </option>
              ))}
          </select>

          <div className="flex flex-wrap gap-2 mt-2">
            {team.memberUserIds.map((id) => {
<<<<<<< Updated upstream
              const member = members.find((emp) => emp._id === id);
=======
              const member = filteredEmployees.find(
                (emp) => emp.userId._id === id
              );
>>>>>>> Stashed changes
              return (
                <span
                  key={id}
                  className="flex items-center bg-teal-100 text-teal-800 text-sm px-2 py-1 rounded-full"
                >
<<<<<<< Updated upstream
                  ✔ {member?.name}
                  <button
                    type="button"
                    onClick={() => handleRemoveMember(id)}
                    className="ml-2 text-red-500 hover:text-red-700 font-bold"
=======
                  ✔ {member?.userId.name}
                  <button
                    type="button"
                    onClick={() => handleRemoveMember(id)}
                    className="ml-2 text-red-500 hover:text-red-700 text-lg font-bold"
>>>>>>> Stashed changes
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
          className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded"
        >
          Add Team
        </button>
      </form>
    </div>
  );
};

export default AddTeam;
