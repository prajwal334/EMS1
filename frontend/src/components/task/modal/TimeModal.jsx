import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./TimeModal.css";

const TimeModal = ({
  isOpen,
  onClose,
  task,
  timeReason,
  setTimeReason,
  onSubmit,
}) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (isOpen && !initialized) {
      if (task && task.startDate && task.endDate) {
        setSelectedDate([new Date(task.startDate), new Date(task.endDate)]);
      } else if (task && task.startDate) {
        setSelectedDate(new Date(task.startDate));
      } else {
        setSelectedDate(null);
      }
      setInitialized(true);
    }
    if (!isOpen) {
      setInitialized(false);
    }
  }, [isOpen, task, initialized]);

  if (!isOpen) return null;

  const [start, end] = Array.isArray(selectedDate)
    ? selectedDate
    : [selectedDate, null];

  const isSameDay = (d1, d2) =>
    d1 && d2 && d1.toDateString() === d2.toDateString();

  const isInRange = (date, rangeStart, rangeEnd) =>
    rangeStart && rangeEnd && date >= rangeStart && date <= rangeEnd;

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
            selectRange={true}
            onChange={setSelectedDate}
            value={selectedDate}
            className="border rounded"
            tileClassName={({ date, view }) => {
              if (view !== "month") return null;

              const taskStart = new Date(task.startDate);
              const taskEnd = new Date(task.endDate);

              if (isSameDay(date, taskStart) || isSameDay(date, taskEnd)) {
                return "highlight-task-fixed";
              }

              if (
                Array.isArray(selectedDate) &&
                isInRange(date, selectedDate[0], selectedDate[1])
              ) {
                return "highlight-range";
              }

              return null;
            }}
          />
          <div className="mt-2 text-sm text-gray-600">
            <p>
              <strong>Start:</strong>{" "}
              {start ? start.toLocaleDateString() : "Not selected"}
            </p>
            <p>
              <strong>End:</strong>{" "}
              {end ? end.toLocaleDateString() : "Not selected"}
            </p>
          </div>
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
            onClick={() => onSubmit(selectedDate)}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimeModal;
