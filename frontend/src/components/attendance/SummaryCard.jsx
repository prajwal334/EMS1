<<<<<<< Updated upstream
import React from 'react';

const SummaryCard = ({ icon, text, number, color = '#cddbf6' }) => {
  return (
    <div
      className="w-42 h-34 bg-[#cddbf6] rounded-2xl flex flex-col items-center justify-center text-center px-4"
      style={{
        backgroundColor: color,
        boxShadow: "0 12px 25px rgba(0, 0, 0, 0.2)",
      }}
    >
      <div className="text-4xl text-black mt-0.5 mb-8">{icon}</div>
      <p className="text-gray-600 text-sm">{text}</p>
      <p className="text-gray-900 text-2xl font-bold mb-4">{number}</p>
=======
import React from "react";

const SummaryCard = ({ icon, text, number, color }) => {
  return (
    <div className="flex items-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 w-full">
      <div
        className={`flex items-center justify-center w-14 h-14 rounded-full ${color} text-white text-2xl`}
      >
        {icon}
      </div>
      <div className="ml-4">
        <p className="text-sm text-gray-500">{text}</p>
        <p className="text-2xl font-bold text-gray-800">{number}</p>
      </div>
>>>>>>> Stashed changes
    </div>
  );
};

export default SummaryCard;
