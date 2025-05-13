import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

const View = () => {
  const [salaries, setSalaries] = useState(null);
  const [filteredSalaries, setFilteredSalaries] = useState(null);
  const { id } = useParams();
  let sno = 1;

  const fetchSalareis = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/salary/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(response.data);
      if (response.data.success) {
        setSalaries(response.data.salary);
        setFilteredSalaries(response.data.salary);
      }
    } catch (error) {
      if (error.response && !error.response.data.success) {
        alert(error.message);
      }
    }
  };

  useEffect(() => {
    fetchSalareis();
  }, []);

  const filterSalaries = (q) => {
    const filteredRecords = salaries.filter((leave) =>
      leave.employeeId.toLocaleLowerCase().includes(q.toLocaleLowerCase())
    );
    setFilteredSalaries(filteredRecords);
  };
  return (
    <>
      {filteredSalaries === null ? (
        <div>Loading...</div>
      ) : (
        <div className="overflow-x-auto p-5">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-6">Salary Details</h2>
          </div>
          <div className="flex justify-end my-3">
            <input
              type="text"
              placeholder="Search by Employee ID"
              className="border border-gray-300 rounded-md px-2 py-0.5"
              onChange={filterSalaries}
            />
          </div>

          {filteredSalaries.length > 0 ? (
            <table className="w-full text-sm text-left  border border-gray-300 rounded-md shadow-md">
              <thead className="text-sm text-gray-700 uppercase bg-gray-50 border border-gray-300">
                <tr>
                  <th className="px-6 py-3">SNo</th>
                  <th className="px-6 py-3">Emp ID</th>
                  <th className="px-6 py-3">Salary</th>
                  <th className="px-6 py-3">Allowance</th>
                  <th className="px-6 py-3">Deductions</th>
                  <th className="px-6 py-3">Total</th>
                  <th className="px-6 py-3">Pay Date</th>
                </tr>
              </thead>
              <tbody>
  {filteredSalaries.map((salary) => {
    try {
      return (
        <tr key={salary._id} className="bg-white border-b hover:bg-gray-50">
          <td className="px-6 py-3">{sno++}</td>
          <td className="px-6 py-3">{salary.employeeId?.employeeId || "N/A"}</td>
          <td className="px-6 py-3">{salary.basicSalary}</td>
          <td className="px-6 py-3">
            {salary.allowances ? JSON.stringify(salary.allowances) : "N/A"}
          </td>
          <td className="px-6 py-3">
            {salary.deductions ? JSON.stringify(salary.deductions) : "N/A"}
          </td>
          <td className="px-6 py-3">{salary.netSalary}</td>
          <td className="px-6 py-3">{new Date(salary.payDate).toLocaleDateString()}</td>
        </tr>
      );
    } catch (err) {
      console.error("Error rendering salary row:", err, salary);
      return null;
    }
  })}
</tbody>

            </table>
          ) : (
            <div>No Records</div>
          )}
        </div>
      )}
    </>
  );
};

export default View;
