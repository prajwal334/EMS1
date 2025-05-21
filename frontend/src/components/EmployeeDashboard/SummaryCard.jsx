import React from 'react';

const SummaryCard = ({ icon, text, number, color }) => {
  return (
    <div className="flex items-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-transform hover:scale-[1.02] duration-200">
      <div className={`flex items-center justify-center w-14 h-14 rounded-full ${color} text-white text-2xl`}>
        {icon}
      </div>
      <div className="ml-4">
        <p className="text-gray-600 text-sm">{text}</p>
        <p className="text-gray-900 text-2xl font-bold">{number}</p>
      </div>
    </div>
  );
};

export default SummaryCard;
