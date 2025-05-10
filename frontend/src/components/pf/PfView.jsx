import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PfView = ({ employeeId }) => {
  const [pfData, setPfData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPf = async () => {
      try {
        const res = await axios.get(`/api/pf/${employeeId}`); // Fetching PF data based on employeeId
        if (res.status === 200) {
          setPfData(res.data); // Set PF data if successful
        } else {
          console.error("No PF data found.");
          setPfData(null); // Handle no data case
        }
      } catch (err) {
        console.error("Error fetching PF data:", err);
        setPfData(null); // Handle API errors
      }
    };
    fetchPf();
  }, [employeeId]); // Re-fetch if employeeId changes

  if (!pfData) return <p>Loading PF details...</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">PF Account Details</h2>
      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-400">
              <th className="px-4 py-2 text-left">Detail</th>
              <th className="px-4 py-2 text-left">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t">
              <td className="px-4 py-2 font-semibold">Initial PF</td>
              <td className="px-4 py-2">₹{pfData.initialPf}</td>
            </tr>
            <tr className="border-t">
              <td className="px-4 py-2 font-semibold">Last Updated PF</td>
              <td className="px-4 py-2">₹{pfData.lastUpdatedPf}</td>
            </tr>
            <tr className="border-t">
              <td className="px-4 py-2 font-semibold">Paid Amount</td>
              <td className="px-4 py-2">₹{pfData.paidAmount}</td>
            </tr>
            <tr className="border-t">
              <td className="px-4 py-2 font-semibold">Current Updated PF</td>
              <td className="px-4 py-2">₹{pfData.currentUpdatedPf}</td>
            </tr>
            <tr className="border-t">
              <td className="px-4 py-2 font-semibold">Amount by Company</td>
              <td className="px-4 py-2">₹{pfData.interestCompany}</td>
            </tr>
            <tr className="border-t">
              <td className="px-4 py-2 font-semibold">Amount by Government</td>
              <td className="px-4 py-2">₹{pfData.interestGovernment}</td>
            </tr>
            <tr className="border-t bg-gray-400">
              <td className="px-4 py-2 font-semibold">Total</td>
              <td className="px-4 py-2">₹{pfData.total}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PfView;
