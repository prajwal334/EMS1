import React from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { FiClock, FiX } from "react-icons/fi";
import "./calendarOverride.css"; // <-- for custom CSS (we’ll define it below)

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

  const currentMonth = new Date().getMonth();

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl p-6 relative w-[900px] max-w-full flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-black text-xl"
          onClick={onClose}
          aria-label="Close"
        >
          <FiX size={24} />
        </button>

        {/* Title with Delay Icon */}
        <div className="flex items-center gap-2 mb-6 pl-1">
          <FiClock size={24} className="text-black" />
          <h2 className="text-xl font-semibold text-gray-800">Delay</h2>
        </div>

        {/* Content Area */}
        <div className="flex gap-6">
          {/* Calendar */}
          <div className="w-[40%] border rounded-xl p-4 shadow-inner">
            <label className="font-semibold text-gray-700 block mb-2">
              Submit By:
            </label>
            <Calendar
              onChange={setSelectedDate}
              value={selectedDate}
              className="w-full  custom-calendar"
              tileClassName={({ date, view }) => {
                if (view === "month") {
                  return date.getMonth() !== selectedDate.getMonth()
                    ? "text-gray-400"
                    : "text-black";
                }
                return "";
              }}
            />
          </div>

          {/* Reason */}
          <div className="w-[55%]  justify-between">
            <div>
              <label className="block font-semibold text-gray-700 mb-2">
                Reason:
              </label>
              <textarea
                placeholder="Enter your Reason"
                rows={8}
                maxLength={1000}
                className="w-full border rounded-lg p-3 resize-none text-sm text-gray-800 shadow-inner"
                value={timeReason}
                onChange={(e) => setTimeReason(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Bottom Right Button */}
        <div className="flex justify-end mt-6">
          <button
            className="bg-blue-600 text-white font-semibold px-5 py-2 rounded-lg hover:bg-blue-700 shadow"
            onClick={onSubmit}
          >
            Request for Review
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimeModal;
