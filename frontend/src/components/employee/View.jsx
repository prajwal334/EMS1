import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const View = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/employee/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (response.data.success) {
          setEmployee(response.data.employee);
        }
      } catch (error) {
        if (error.response && !error.response.data.success) {
          alert(error.response.data.error);
        }
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
        {/* Left Column */}
        <div className="space-y-4">
          <Info label="Name" value={employee.userId.name} />
          <Info label="Employee ID" value={employee.employeeId} />
          <Info label="Email" value={employee.userId.email} />
          <Info label="Phone" value={employee.phone} />
          <Info label="Address" value={employee.address} />
          <Info label="PAN" value={employee.pan} />
          <Info label="Aadhar" value={employee.aadhar} />
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <Info label="Designation" value={employee.designation} />
          <Info label="Date of Joining" value={new Date(employee.doj).toLocaleDateString()} />
          <Info label="Gender" value={employee.gender} />
          <Info label="Marital Status" value={employee.maritalStatus} />
          <Info label="Department" value={employee.department?.dep_name || "N/A"} />
          <Info label="Grade" value={employee.grade} />
          <Info label="CTC" value={`₹ ${employee.salary}`} />
        </div>
      </div>

      {/* Bank Details Section */}
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
    </div>
  ) : (
    <div className="text-center mt-10">Loading...</div>
  );
};

// Reusable Info component for consistent styling
const Info = ({ label, value }) => (
  <div className="flex">
    <span className="w-40 font-semibold text-gray-700">{label}:</span>
    <span className="text-gray-800">{value || "N/A"}</span>
  </div>
);

export default View;
