import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const View = () => {
  const {id} = useParams();
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const responnse = await axios.get(
          `http://localhost:3000/api/employee/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log(responnse.data)
        if (responnse.data.success) {
          setEmployee(responnse.data.employee);
        } 
      } catch (error) {
        if (error.response && !error.response.data.success) {
            alert(error.response.data.error);
        }
      }
    };
    fetchEmployee();
  }, []);

  return (
    <>
      {employee ? (
        <div className="max-w-3xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md">
          <h2 className="text-2xl font-bold mb-6">Employee Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 mb-6">
            <div>
                <img
                  src={`http://localhost:3000/${employee.userId.profileImage}`}
                
                  className="rounded-full border w-72"
                />
            </div>
            <div>
              <div className="flex space-x-4 mb-4">
                <p className="text-lg font-bold">Name</p>
                <p className="text-lg">{employee.userId.name}</p>
              </div>
              <div className="flex space-x-4 mb-4">
                <p className="text-lg font-bold">Employee ID</p>
                <p className="text-lg">{employee.employeeId}</p>
              </div>
              <div className="flex space-x-4 mb-4">
                <p className="text-lg font-bold">Date of Joining:</p>
                <p className="text-lg">
                  {new Date(employee.doj).toLocaleDateString()}
                </p>
              </div>
              <div className="flex space-x-4 mb-4">
                <p className="text-lg font-bold">Gender:</p>
                <p className="text-lg">{employee.gender}</p>
              </div>
 
              <div className="flex space-x-4 mb-4">
                <p className="text-lg font-bold">Department:</p>
                <p className="text-lg">{employee.department?.dep_name || "N/A"}</p>
              </div>
              <div className="flex space-x-4 mb-4">
                <p className="text-lg font-bold">Marital Status:</p>
                <p className="text-lg">{employee.maritalStatus}</p>
              </div>
              <div className="flex space-x-4 mb-4">
                <p className="text-lg font-bold">CTC:</p>
                <p className="text-lg">{employee.salary}</p>
                </div>
            </div>
          </div>
        </div>
      ) : (
        <div>Loding...</div>
      )}
    </>
  );
};

export default View;
