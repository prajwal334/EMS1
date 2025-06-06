import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import DataTable from "react-data-table-component";
import { columns } from "../../utils/EmployeeHelper";

const List = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeDepartment, setActiveDepartment] = useState("ALL");

  // 🔄 Fetch All Employees
  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:3000/api/employee", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.data.success) {
          let sno = 1;
          const mapped = response.data.employees.map((emp) => ({
            _id: emp._id,
            sno: sno++,
            profileImage: emp.userId?.profileImage || null,
            empId: emp.userId?.empId || "N/A",
            name: emp.userId?.name || "N/A",
            doj: emp.doj,
            dep_name: emp.department?.dep_name || "N/A",
          }));
          setEmployees(mapped);
          setFilteredEmployees(mapped);
        }
      } catch (err) {
        alert(err?.response?.data?.error || "Failed to fetch employee data.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  // 🔍 Search Filter
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    const result = employees.filter((emp) =>
      emp.name.toLowerCase().includes(value)
    );
    setFilteredEmployees(result);
  };

  // 🏢 Department Filter
  const handleDepartmentFilter = (dep) => {
    setActiveDepartment(dep);
    if (dep === "ALL") {
      setFilteredEmployees(employees);
    } else {
      const result = employees.filter(
        (emp) => emp.dep_name.toLowerCase() === dep.toLowerCase()
      );
      setFilteredEmployees(result);
    }
  };

  return (
    <div className="p-4 shadow-md rounded-lg">
      <div className="text-center mb-4">
        <h3 className="text-2xl font-bold">Manage Employees</h3>
      </div>

      {/* Department Buttons & Add */}
      <div className="flex justify-between flex-wrap gap-3 items-center mb-3">
        <div className="flex flex-wrap gap-2">
          {[
            "IT",
            "HR",
            "Sales",
            "Marketing",
            "Compliance",
            "Finance",
            "Operations",
            "ALL",
          ].map((label) => (
            <button
              key={label}
              onClick={() => handleDepartmentFilter(label)}
              className={`px-4 py-1 rounded shadow-md ${
                activeDepartment === label
                  ? "bg-blue-700 text-white"
                  : "bg-blue-400 text-black hover:bg-blue-600"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <Link
          to="/admin-dashboard/add-employee"
          className="px-4 py-1 bg-green-600 rounded text-white hover:bg-green-800 shadow"
        >
          Add Employee
        </Link>
      </div>

      {/* Search Box */}
      <div className="flex justify-end mb-3">
        <input
          type="text"
          placeholder="Search Employee..."
          onChange={handleSearch}
          className="px-4 py-1 border rounded shadow-sm"
        />
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredEmployees}
        progressPending={loading}
        pagination
        highlightOnHover
        striped
        responsive
        noDataComponent={<div className="py-4">No employees found.</div>}
        progressComponent={<div className="py-4">Loading employees...</div>}
      />
    </div>
  );
};

export default List;
