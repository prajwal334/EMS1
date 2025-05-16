import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { FaEye, FaEdit,FaUserCircle, FaMoneyCheckAlt, FaPlaneDeparture } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

// 🔧 Reusable Action Buttons
export const EmployeeButtons = ({ Id }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-wrap gap-2">
      <button
        title="View Profile"
        className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
        onClick={() => navigate(`/admin-dashboard/employees/${Id}`)}
      >
        <FaEye />
        View
      </button>

      <button
        title="Edit Employee"
        className="flex items-center gap-1 bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm"
        onClick={() => navigate(`/admin-dashboard/employees/edit/${Id}`)}
      >
        <FaEdit />
        Edit
      </button>

      <button
        title="View Salary"
        className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
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
  );
};

export const fetchDepartments = async () => {
  let departments;
  try {
    const response = await axios.get("http://localhost:3000/api/department", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (response.data.success) {
      departments = response.data.departments;
    }
  } catch (error) {
    if (error.response && !error.response.data.success) {
      alert(error.response.data.error);
    }
  }
  return departments;
};

//employees for salary
export const getEmployees = async (id) => {
  let employees;
  try {
    const response = await axios.get(`http://localhost:3000/api/employee/department/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (response.data.success) {
      employees = response.data.employees;
    }
  } catch (error) {
    if (error.response && !error.response.data.success) {
      alert(error.response.data.error);
    }
  }
  return employees;
};
// 📊 Table Columns
export const columns = [
  {
    name: "S No",
    selector: (row, index) => index + 1,
    width: "70px",
  },
  {
  name: "Image",
  cell: (row) =>
    row.profileImage ? (
      <img
        src={`http://localhost:3000/uploads/${row.profileImage}`}
        alt={row.name}
        className="w-12 h-12 rounded-full border shadow-sm object-cover"
      />
    ) : (
      <FaUserCircle className="text-gray-400 text-3xl" />
    ),
  width: "80px",
},

  {
    name: "Name",
    selector: (row) => row.name,
    sortable: true,
  },
  {
    name: "Department",
    selector: (row) => row.dep_name,
  },
  {
    name: "DOJ",
    selector: (row) => new Date(row.doj).toLocaleDateString(),
    sortable: true,
  },
  {
    name: "Action",
    cell: (row) => <EmployeeButtons Id={row._id} />,
    ignoreRowClick: true,
    allowOverflow: true,
    button: true,
  },
];

// 🚀 Main Component
export const EmployeeTable = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/employee", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        setEmployees(res.data.employees);
      }
    } catch (err) {
      console.error("Failed to load employees", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Employee Directory</h2>

      <DataTable
        columns={columns}
        data={employees}
        progressPending={loading}
        pagination
        highlightOnHover
        striped
        responsive
        customStyles={{
          headCells: {
            style: {
              fontWeight: "600",
              fontSize: "14px",
              backgroundColor: "#f1f5f9",
              color: "#1e293b",
            },
          },
        }}
      />
    </div>
  );
};

