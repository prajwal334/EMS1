import axios from "axios";
import React, { useEffect, useState } from "react";
import {  useNavigate, useParams } from "react-router-dom";

const DetailLeave = () => {
  const {id} = useParams();
  const [leave, setLeave] = useState(null);
    const navigate = useNavigate();

  useEffect(() => {
    const fetchLeave = async () => {
      try {
        const responnse = await axios.get(
          `http://localhost:3000/api/leave/detail/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (responnse.data.success) {
          setLeave(responnse.data.leave);
        } 
      } catch (error) {
        if (error.response && !error.response.data.success) {
            alert(error.response.data.error);
        }
      }
    };
    fetchLeave();
  }, []);

  const changeStatus = async (id, status) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/api/leave/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.success) {
        navigate("/admin-dashboard/leaves");
      }
    } catch (error) {
      if (error.response && !error.response.data.success) {
        alert(error.response.data.error);
      }
    }
  }

  return (
    <>
      {leave ? (
        <div className="max-w-3xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md">
          <h2 className="text-2xl font-bold mb-6">Employee Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 mb-6">
            <div>
                <img
                  src={`http://localhost:3000/${leave.employeeId.userId.profileImage}`}
                
                  className="rounded-full border w-72"
                />
            </div>
            <div>
              <div className="flex space-x-4 mb-4">
                <p className="text-lg font-bold">Name</p>
                <p className="text-lg">{leave.employeeId.userId.name}</p>
              </div>
              <div className="flex space-x-4 mb-4">
                <p className="text-lg font-bold">Employee ID</p>
                <p className="text-lg">{leave.employeeId.employeeId}</p>
              </div>
              <div className="flex space-x-4 mb-4">
                <p className="text-lg font-bold">Leave Type</p>
                <p className="text-lg">
                    {leave.leaveType}
                </p>
              </div>
              <div className="flex space-x-4 mb-4">
                <p className="text-lg font-bold">Reason:</p>
                <p className="text-lg">{leave.reason}</p>
              </div>
 
              <div className="flex space-x-4 mb-4">
                <p className="text-lg font-bold">Department:</p>
                <p className="text-lg">{leave.employeeId.department?.dep_name || "N/A"}</p>
              </div>
              <div className="flex space-x-4 mb-4">
                <p className="text-lg font-bold">Start Date:</p>
                <p className="text-lg">{new Date(leave.startDate).toLocaleDateString()}</p>
              </div>
              <div className="flex space-x-4 mb-4">
                <p className="text-lg font-bold">End Date:</p>
                <p className="text-lg">{new Date(leave.endDate).toLocaleDateString()}</p>
              </div>
              <div className="flex space-x-4 mb-4">
                <p className="text-lg font-bold">
                     {leave.status === "Pending" ? "Action" : "Status"}
                     </p>
                     {leave.status === "Pending" ? (
                      <div className="flex space-x-4 mb-4">
                        <button className="bg-green-500 text-white px-2 py-1 rounded"
                        onClick={() => changeStatus(leave._id, "Approved")}>Approve</button>
                        <button className="bg-red-500 text-white px-2 py-1 rounded"
                        onClick={() => changeStatus(leave._id, "Rejected")}>Reject</button>
                      </div>
                     ) : 
                      <p className="text-lg">{leave.status}</p>
                     }
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

export default DetailLeave;
