import React from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const TimeModal = ({
  isOpen,
  onClose,
  selectedDate,
  setSelectedDate,
  timeReason,
  setTimeReason,
  onSubmit,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg p-6 relative w-[600px] max-w-full flex"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
          onClick={onClose}
          aria-label="Close"
        >
          ✖️
        </button>

        <div className="flex-1 mr-6">
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            className="border rounded"
          />
        </div>

        <div className="flex-1 flex flex-col">
          <label className="block font-semibold mb-2 text-gray-700">
            Reason
          </label>
          <textarea
            rows={6}
            maxLength={1000}
            className="border p-2 rounded mb-4"
            value={timeReason}
            onChange={(e) => setTimeReason(e.target.value)}
          />
          <button
            className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
            onClick={onSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimeModal;
