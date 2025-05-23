import React from "react";

const SummaryCard = ({ icon, text, number, color }) => {
  return (
    <div className="rounded-lg flex shadow-lg bg-white p-4">
      <div
        className={`text-3xl flex justify-center items-center ${color} text-white rounded-lg p-4`}
      >
        {icon}
      </div>
      <div className="pl-4 py-1">
        <p className="text-lg font-semibold">{text}</p>
        <p className="text-xl font-bold">{number}</p>
      </div>
    </div>
  );
};

export default SummaryCard;
