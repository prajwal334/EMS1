import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const EmDptTaskList = ({ departmentId }) => {
  const [departments, setDepartments] = useState([]);
  const [salesDepId, setSalesDepId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:3000/api/department", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        const deps = data.departments || [];
        setDepartments(deps);

        // Find Sales department ID
        const salesDep = deps.find((dep) => dep.dep_name === "Sales");
        if (salesDep) setSalesDepId(salesDep._id);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    fetchDepartments();
  }, []);

  const handleCardClick = (depId, isActive) => {
    if (isActive) {
      navigate(`/employee-dashboard/tasks/department/${depId}`);
    }
  };

  const isSalesSelected = departmentId === salesDepId;

  return (
    <div
      className={`w-full ${
        isSalesSelected ? "p-0 m-0" : "px-6 md:px-12 lg:px-20 py-8"
      }`}
    >
      <h2 className="text-2xl font-bold text-center mb-8">Departments</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {departments.map((dep) => {
          const isActive = dep._id === departmentId;

          return (
            <div
              key={dep._id}
              onClick={() => handleCardClick(dep._id, isActive)}
              className={`rounded-xl p-4 text-center transition-all duration-300 bg-white
                ${
                  isActive
                    ? "cursor-pointer hover:bg-blue-100 hover:scale-105 shadow-md"
                    : "cursor-not-allowed hover:bg-red-100 opacity-80"
                }`}
            >
              <h3 className="text-lg font-semibold">{dep.dep_name}</h3>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EmDptTaskList;
