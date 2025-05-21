import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {FaEdit, FaMoneyCheckAlt, FaPlaneDeparture } from "react-icons/fa";


const View = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
    const navigate = useNavigate();

  

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/employee/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.data.success) {
          setEmployee(response.data.employee);
        }
      } catch (error) {
        const message =
          error?.response?.data?.error || "Failed to load employee details.";
        alert(message);
      }
    };

    fetchEmployee();
  }, [id]);



  return employee ? (
    <div className="max-w-4xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md">
      <h2 className="text-3xl font-bold text-center mb-8">Employee Profile</h2>

      <div className="flex justify-center mb-6">
        <img
          src={`http://localhost:3000/uploads/${employee.userId.profileImage}`}
          alt="Profile"
          className="rounded-full border w-36 h-36 object-cover"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Info label="Name" value={employee.userId.name} />
          <Info label="Employee ID" value={employee.employeeId} />
          <Info label="Email" value={employee.userId.email} />
          <Info label="Phone" value={employee.phone} />
          <Info label="Address" value={employee.address} />
          <Info label="PAN" value={employee.pan} />
          <Info label="Aadhar" value={employee.aadhar} />
        </div>

        <div className="space-y-4">
          <Info label="Designation" value={employee.designation} />
          <Info
            label="Date of Joining"
            value={new Date(employee.doj).toLocaleDateString()}
          />
          <Info label="Gender" value={employee.gender} />
          <Info label="Marital Status" value={employee.maritalStatus} />
          <Info
            label="Department"
            value={employee.department?.dep_name || "N/A"}
          />
          <Info label="Grade" value={employee.grade} />
          <Info label="CTC" value={`₹ ${employee.salary}`} />
        </div>
      </div>

      <div className="mt-10 border-t pt-6">
        <h3 className="text-xl font-semibold mb-4">Bank Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Info label="Bank Name" value={employee.bankname} />
          <Info label="Account Holder Name" value={employee.bankacname} />
          <Info label="Account Number" value={employee.bankac} />
          <Info label="Branch Name" value={employee.branchname} />
          <Info label="Account Type" value={employee.accountType} />
          <Info label="IFSC Code" value={employee.ifsc} />
        </div>
      </div>

      <div className="mt-10 text-center">
        <button
                title="Edit Employee"
                className="flex items-center gap-1 bg-purple-600 hover:bg-purple-700 text-white px-2 py-1 rounded text-sm"
                onClick={() => navigate(`/admin-dashboard/employees/edit/${Id}`)}
              >
                <FaEdit />
                Edit
              </button>
        
              <button
                title="View Salary"
                className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-sm"
                onClick={() => navigate(`/admin-dashboard/employees/salary/${Id}`)}
              >
                <FaMoneyCheckAlt />
                Salary
              </button>
        
              <button
                title="Leave Details"
                className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                onClick={() => navigate(`/admin-dashboard/employees/leaves/${Id}`)}
              >
                <FaPlaneDeparture />
                Leave
              </button>
              </div>
    </div>
  ) : (
    <div className="text-center mt-10">Loading...</div>
  );
};

// Reusable info display
const Info = ({ label, value }) => (
  <div className="flex">
    <span className="w-40 font-semibold text-gray-700">{label}:</span>
    <span className="text-gray-800">{value || "N/A"}</span>
  </div>
);

export default View;
