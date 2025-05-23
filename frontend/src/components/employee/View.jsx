import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaEdit, FaMoneyCheckAlt, FaPlaneDeparture } from "react-icons/fa";

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
<h2 className="text-3xl font-bold text-center mb-8 text-gray-800 drop-shadow-[2px_2px_3px_rgba(0,0,0,0.5)] transform transition-transform hover:scale-105 hover:translate-y-1">
  Employee Profile
</h2>
      <div className="flex justify-center mb-6">
  <div className="relative w-36 h-36 perspective-1000">
    <div className="w-full h-full transform transition-transform duration-500 hover:rotate-y-6 hover:scale-105 shadow-2xl rounded-full overflow-hidden">
      {employee?.userId?.profileImage ? (
        <img
          src={`http://localhost:3000/uploads/${employee.userId.profileImage}`}
          alt="Profile"
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
          <svg
            className="w-16 h-16 text-gray-500"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z" />
          </svg>
        </div>
      )}
    </div>
  </div>
</div>


      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Info label="Name" value={employee.userId.name} />
          <Info label="Employee ID" value={employee.employeeId} />
          <Info label="NVKSH PERNO" value={employee.nvkshPerno} />
          <Info label="NVKSH UNIT PERNO" value={employee.nvkshUnitPerno} />
          <Info label="Email" value={employee.userId.email} />
          <Info label="Phone" value={employee.phone} />
          <Info label="Address" value={employee.address} />
          <Info label="PAN" value={employee.pan} />
        </div>

        <div className="space-y-4">
          <Info label="Aadhar" value={employee.aadhar} />
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
