import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import DataTable from "react-data-table-component";
import { columns, EmployeeButtons } from "../../utils/EmployeeHelper";

const List = () => {
  const [employees, setEmployees] = useState([]);
  const [empLoading, setEmpLoading] = useState(false);
  const [filteredEmployee, setFilteredEmployees] = useState([]);
  const [filteredDepartment, setFilteredDepartment] = useState([]);
  const [activeDepartment, setActiveDepartment] = useState("ALL");

  useEffect(() => {
    const fetchEmployees = async () => {
      setEmpLoading(true);
      try {
        const response = await axios.get("http://localhost:3000/api/employee", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.data.success) {
          let sno = 1;
          const data = response.data.employees.map((emp) => ({
            _id: emp._id,
            sno: sno++,
            profileImage: emp.userId.profileImage,
            empId: emp.userId.empId,
            name: emp.userId.name,
            doj: new Date(emp.doj).toDateString(),
            dep_name: emp.department?.dep_name || "N/A",
            actions: <EmployeeButtons Id={emp._id} />,
          }));
          setEmployees(data);
          setFilteredEmployees(data);
        }
      } catch (error) {
        const message =
          error?.response?.data?.error || "Failed to fetch employee data.";
        alert(message);
      } finally {
        setEmpLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const handleDepartmentFilter = (department) => {
  setActiveDepartment(department);
  if (department === "ALL") {
    setFilteredEmployees(employees);
  } else {
    const records = employees.filter(
      (emp) => emp.dep_name.toLowerCase() === department.toLowerCase()
    );
    setFilteredEmployees(records);
  }
};



  
  const handleFilter = (e) => {
    const keyword = e.target.value.toLowerCase();
    const records = employees.filter((emp) =>
      emp.name.toLowerCase().includes(keyword)
    );
    setFilteredEmployees(records);
  };

  return (
    <div className="p-4 shadow-md rounded-lg">
      <div className="text-center mb-4">
        <h3 className="text-2xl font-bold">Manage Employee</h3>
      </div>

      <div className="mb-1">
  <div className="flex justify-between items-center mb-2">
    <div className="flex flex-wrap gap-2">
      {["IT", "HR", "Sales", "Marketing", "Compliance", "Finance", "Operations", "ALL"].map((label) => (
  <button
    key={label}
    onClick={() => handleDepartmentFilter(label)}
    className={`px-4 py-1 rounded shadow-lg ${
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
      className="px-4 py-1 bg-blue-600 rounded hover:bg-blue-800 text-white shadow-lg"
    >
      Add Employee
    </Link>
  </div>

  <div className="flex justify-end">
    <input
      type="text"
      placeholder="Search Employee..."
      className="px-4 py-1 border border-gray-300 rounded shadow-sm"
      onChange={handleFilter}
    />
  </div>
</div>


      <div className="mt-3 shadow-md rounded-lg">
        <DataTable
          columns={columns}
          data={filteredEmployee}
          pagination
          progressPending={empLoading}
          persistTableHead
        />
      </div>
    </div>
  );
};

export default List;
