import React from "react";
import { FiX, FiMessageCircle } from "react-icons/fi";

const QueryModal = ({ isOpen, onClose, onSend, queryText, setQueryText }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-[450px] p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-black hover:text-gray-800"
          onClick={onClose}
          aria-label="Close"
        >
          <FiX size={22} />
        </button>

        {/* Header with Icon */}
        <div className="flex items-center gap-2 mb-4">
          <FiMessageCircle size={24} className="text-black" />
          <h3 className="text-xl font-semibold text-black">Queries</h3>
        </div>

        {/* Textarea */}
        <textarea
          className="w-full border border-gray-300 rounded-lg p-3 text-sm resize-none h-40 overflow-y-auto shadow-inner placeholder:text-gray-400"
          maxLength={1000}
          value={queryText}
          onChange={(e) => setQueryText(e.target.value)}
          placeholder="Enter your Query"
        />

        {/* Submit Button */}
        <div className="flex justify-end mt-4">
          <button
            className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700"
            onClick={onSend}
          >
            REQUEST FOR REVIEW
          </button>
        </div>
      </div>
    </div>
  );
};

export default QueryModal;
