import React, { useState, useEffect } from "react";
import { fetchDepartments } from "../../utils/EmployeeHelper";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Add = () => {
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [subDepartments, setSubDepartments] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const getDepartments = async () => {
      const departments = await fetchDepartments();
      setDepartments(departments);
    };
    getDepartments();
  }, []);

  const handleChange = async (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      setImageFile(files[0]);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));

      // Fetch sub-departments when department changes
      if (name === "department") {
        try {
          const response = await axios.get(
            `http://localhost:3000/api/department/${value}/subdepartments`
          );
          setSubDepartments(response.data.subDepartments);

          // reset designation when department changes
          setFormData((prev) => ({ ...prev, designation: "" }));
        } catch (error) {
          console.error("Failed to fetch sub-departments:", error);
          setSubDepartments([]);
        }
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataObj = new FormData();

    // Append all fields except 'designation'
    for (const key in formData) {
      if (key !== "designation") {
        formDataObj.append(key, formData[key]);
      }
    }

    // Convert sub-department _id to its name for the 'designation' field
    const selectedSubDep = subDepartments.find(
      (subDep) => subDep._id === formData.designation
    );

    if (selectedSubDep) {
      formDataObj.append("designation", selectedSubDep.name);
    } else {
      formDataObj.append("designation", formData.designation);
    }

    // Append image if available
    if (imageFile) {
      formDataObj.append("image", imageFile);
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/api/employee/add",
        formDataObj,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        navigate("/admin-dashboard/employees");
      }
    } catch (error) {
      console.error("Error submitting:", error);
      alert(error?.response?.data?.error || "Server error");
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-6">Add Employee</h2>
      <form onSubmit={handleSubmit}>
        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* First Name and Last Name Fields */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              name="name"
              onChange={handleChange}
              placeholder="Enter Full Name"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* Username Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username || ""}
              placeholder="Enter Username"
              onChange={handleChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            />
          </div>
          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              onChange={handleChange}
              placeholder="Enter Email"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* NVKSH PERNO Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              NVKSH PERNO
            </label>
            <input
              type="number"
              name="nvkshPerno"
              onChange={handleChange}
              placeholder="Enter NVKSH PERNO"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* NVKSH UNIT PERNO Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              NVKSH UNIT PERNO
            </label>
            <input
              type="number"
              name="nvkshUnitPerno"
              onChange={handleChange}
              placeholder="Enter NVKSH UNIT PERNO"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            />
          </div>

          {/*  GRADE Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              GRADE
            </label>
            <select
              name="grade"
              onChange={handleChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            >
              <option value="">Select Grade</option>
              <option value="S3">S3</option>
              <option value="S2">S2</option>
              <option value="S1">S1</option>
              <option value="S0">S0</option>
              <option value="E3">E3</option>
              <option value="E2">E2</option>
              <option value="E1">E1</option>
              <option value="E0">E0</option>
            </select>
          </div>

          {/* Department Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Department
            </label>
            <select
              name="department"
              onChange={handleChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            >
              <option value="">Select Department</option>
              {departments.map((dep) => (
                <option key={dep._id} value={dep._id}>
                  {dep.dep_name}
                </option>
              ))}
            </select>
          </div>
          {/* Designation Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Designation
            </label>
            <select
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            >
              <option value="">Select Designation</option>
              {subDepartments.map((subDep) => (
                <option key={subDep._id} value={subDep._id}>
                  {subDep.name}
                </option>
              ))}
            </select>
          </div>

          {/* Employee Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Employee ID
            </label>
            <input
              type="text"
              name="employeeId"
              onChange={handleChange}
              placeholder="Enter Employee ID"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* DOJ Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date of Joining
            </label>
            <input
              type="date"
              name="doj"
              onChange={handleChange}
              placeholder="Enter Date of Joining"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Gender
            </label>
            <select
              name="gender"
              onChange={handleChange}
              placeholder="Select"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            >
              <option value="">Select Gender </option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Marital Status Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Marital Status
            </label>
            <select
              name="maritalStatus"
              onChange={handleChange}
              placeholder="Select Marital Status"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            >
              <option value="">Select Marital Status</option>
              <option value="single">Single</option>
              <option value="married">Married</option>
              <option value="divorced">Divorced</option>
            </select>
          </div>

          {/* Phone Number Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              onChange={handleChange}
              placeholder="Enter Phone Number"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            />
          </div>
          {/*  PAN Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              PAN
            </label>
            <input
              type="text"
              name="pan"
              onChange={handleChange}
              placeholder="Enter PAN"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            />
          </div>
          {/* Aadhar Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Aadhar Number
            </label>
            <input
              type="number"
              name="aadhar"
              onChange={handleChange}
              placeholder="Enter Aadhar Number"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* Address Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <input
              type="text"
              name="address"
              onChange={handleChange}
              placeholder="Enter Address"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Bank A/C No
            </label>
            <input
              type="number"
              name="bankac"
              placeholder="Enter Bank A/C No"
              onChange={handleChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            />
          </div>
          {/* Bank Account Holder Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Bank Account Holder Name
            </label>
            <input
              type="text"
              name="bankacname"
              onChange={handleChange}
              placeholder="Enter Bank Account Holder Name"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            />
          </div>
          {/* Bank Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Bank Name
            </label>
            <input
              type="text"
              name="bankname"
              onChange={handleChange}
              placeholder="Enter Bank Name"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            />
          </div>
          {/* Branch Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Branch Name
            </label>
            <input
              type="text"
              name="branchname"
              onChange={handleChange}
              placeholder="Enter Branch Name"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            />
          </div>
          {/* Account Type Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Account Type
            </label>
            <select
              name="accountType"
              onChange={handleChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            >
              <option value="">Select Account Type</option>
              <option value="savings">Savings</option>
              <option value="current">Current</option>
            </select>
          </div>

          {/* IFSC Code Field */}

          <div>
            <label className="block text-sm font-medium text-gray-700">
              IFSC Code
            </label>
            <input
              type="text"
              name="ifsc"
              onChange={handleChange}
              placeholder="Enter IFSC Code"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* Salary Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              CTC
            </label>
            <input
              type="number"
              name="salary"
              onChange={handleChange}
              placeholder="Enter CTC"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              onChange={handleChange}
              placeholder="Enter Password"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* Role Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <select
              name="role"
              onChange={handleChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            >
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="employee">Employee</option>
              <option value="hr">HR</option>
              <option value="manager">Manager</option>
              <option value="leader">Leader</option>
            </select>
          </div>

          {/* upload Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Upload Image
            </label>
            <input
              type="file"
              name="image"
              onChange={handleChange}
              placeholder="Upload Image"
              accept="image/*"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded"
        >
          Add Employee
        </button>
      </form>
    </div>
  );
};

export default Add;
