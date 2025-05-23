import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddDepartment = () => {
  const [department, setDepartment] = useState({
    dep_name: "",
    description: ""
  });

  const [availableDepartments, setAvailableDepartments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/department', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        if (res.data.success) {
          setAvailableDepartments(res.data.departments);
        }
      } catch (err) {
        alert("Failed to load departments");
      }
    };

    fetchDepartments();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDepartment({ ...department, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/department/add', department, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.data.success) {
        navigate("/admin-dashboard/departments");
      }
    } catch (error) {
      alert(error.response?.data?.error || "Error creating department");
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md w-96">
      <h2 className="text-2xl font-bold mb-6">Add Department</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="dep_name" className="text-sm font-medium text-gray-700">Department Name</label>
          <select
            name="dep_name"
            onChange={handleChange}
            className="mt-1 w-full p-2 border border-gray-300 rounded-md"
            required
          >
            <option value="">Select Department</option>
            {availableDepartments.map(dep => (
              <option key={dep._id} value={dep.dep_name}>
                {dep.dep_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            onChange={handleChange}
            placeholder="Enter department description"
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
            rows="4"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded"
        >
          Add Department
        </button>
      </form>
    </div>
  );
};

export default AddDepartment;
