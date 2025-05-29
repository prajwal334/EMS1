import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Tasklist = () => {
  const { id } = useParams();
  const [department, setDepartment] = useState(null);
  const [subDepartments, setSubDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const token = localStorage.getItem("token");

        // Fetch specific department info
        const depRes = await fetch(
          `http://localhost:3000/api/department/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const depData = await depRes.json();
        setDepartment(depData.department);

        // Fetch sub-departments
        const subRes = await fetch(
          `http://localhost:3000/api/department/${id}/subdepartments`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const subData = await subRes.json();
        setSubDepartments(subData.subDepartments || []);
      } catch (error) {
        console.error("Failed to fetch department or sub-departments", error);
        setError("Failed to load department details.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  return (
    <div className="w-full px-4 md:px-8 lg:px-16 py-8">
      {loading ? (
        <p className="text-center">Loading department details...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <>
          {/* Main Department Card */}
          <div className="flex justify-center mb-6">
            <div className="bg-white rounded-lg shadow-md px-4 py-2 text-center w-64">
              <h2 className="text-lg font-semibold text-gray-800">
                {department?.dep_name}
              </h2>
            </div>
          </div>

          {/* Sub-departments Section */}
          <div className="flex flex-wrap justify-center gap-3">
            {subDepartments.length === 0 ? (
              <p className="text-gray-600">No sub-departments found.</p>
            ) : (
              subDepartments.map((sub) => (
                <div
                  key={sub._id}
                  className="bg-white px-4 py-2 text-sm rounded-lg shadow text-gray-800 cursor-pointer hover:bg-blue-100 hover:scale-105 hover:shadow-lg transition-all duration-300 transform"
                >
                  {sub.name}
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Tasklist;