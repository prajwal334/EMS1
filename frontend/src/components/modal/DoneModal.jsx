import React, { useState, useEffect } from "react";
import {
  FiX,
  FiCheckCircle,
  FiUpload,
  FiTrash2,
  FiImage
} from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DoneModal = ({
  isOpen,
  onClose,
  doneMessage,
  setDoneMessage,
  doneImagePreview,
  handleDoneImageChange,
  onSubmit,
}) => {
  const [showFullPreview, setShowFullPreview] = useState(false);
  const [imageFileNames, setImageFileNames] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const [visible, setVisible] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]);

  useEffect(() => {
    if (isOpen) setTimeout(() => setVisible(true), 10);
    else setVisible(false);
  }, [isOpen]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    files.forEach((file) => {
      if (!file.type.startsWith("image/")) return;

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
      setImageFileNames((prev) => [...prev, file.name]);
    });

    handleDoneImageChange(e); // Use your existing logic
  };

  const handleImageDrop = (e) => {
    e.preventDefault();
    setDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;

    const dataTransferEvent = { target: { files } };
    handleFileChange(dataTransferEvent);
  };

  const handleRemoveImage = (index) => {
    const updatedNames = [...imageFileNames];
    const updatedPreviews = [...imagePreviews];
    updatedNames.splice(index, 1);
    updatedPreviews.splice(index, 1);
    setImageFileNames(updatedNames);
    setImagePreviews(updatedPreviews);
  };

  const handleFinalSubmit = () => {
    onSubmit();
    toast.success("Submitted successfully!", {
      position: "bottom-right",
      autoClose: 2000,
      theme: "dark",
    });
  };

  if (!isOpen) return null;

  return (
    <>
      <ToastContainer />
      <div
        className={`fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 transition-opacity duration-300 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      >
        <div
          className={`bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-[520px] p-6 relative transform transition-all duration-300 ${
            visible ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            className="absolute top-4 right-4 text-black dark:text-white hover:text-gray-700"
            onClick={onClose}
            aria-label="Close"
          >
            <FiX size={22} />
          </button>

          {/* Header */}
          <div className="flex items-center gap-2 mb-4">
            <FiCheckCircle size={26} className="text-black dark:text-white" />
            <h3 className="text-xl font-bold text-black dark:text-white">
              DONE
            </h3>
          </div>

          {/* Message */}
          <textarea
            className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-lg p-3 text-sm resize-none h-32 overflow-y-auto shadow-inner placeholder:text-gray-400"
            maxLength={1000}
            value={doneMessage}
            onChange={(e) => setDoneMessage(e.target.value)}
            placeholder="Enter your message..."
          />

          {/* Upload Section */}
          <div
            className={`mt-4 border-2 border-dashed rounded-lg p-4 text-center transition ${
              dragOver ? "border-blue-400 bg-blue-50" : "border-gray-300"
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleImageDrop}
          >
            <label className="flex items-center justify-center gap-2 cursor-pointer text-black dark:text-white hover:text-gray-700">
              <FiUpload size={20} />
              <span className="text-sm font-medium">
                Upload Images or Drag & Drop
              </span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            {imageFileNames.length > 0 && (
              <ul className="text-sm text-gray-700 dark:text-white mt-2 space-y-2 max-h-32 overflow-y-auto">
                {imageFileNames.map((name, idx) => (
                  <li key={idx} className="flex justify-between items-center">
                    <div className="flex items-center gap-2 truncate">
                      <FiImage />
                      <span className="truncate">{name}</span>
                    </div>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleRemoveImage(idx)}
                    >
                      <FiTrash2 />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Image Previews */}
          {imagePreviews.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-3">
              {imagePreviews.map((src, idx) => (
                <img
                  key={idx}
                  src={src}
                  alt={`Preview ${idx}`}
                  className="w-full h-24 object-cover border rounded hover:scale-105 transition cursor-pointer"
                  onClick={() => {
                    setShowFullPreview(src);
                  }}
                />
              ))}
            </div>
          )}

          {/* Submit */}
          <div className="flex justify-end mt-6">
            <button
              className="bg-blue-600 text-white font-semibold px-5 py-2 rounded-lg hover:bg-blue-700"
              onClick={handleFinalSubmit}
            >
              Task Completed 
            </button>
          </div>
        </div>
      </div>

      {/* Fullscreen Image Viewer */}
      {showFullPreview && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 z-50 flex justify-center items-center"
          onClick={() => setShowFullPreview(null)}
        >
          <img
            src={showFullPreview}
            alt="Full Preview"
            className="max-w-[90%] max-h-[90%] rounded-lg shadow-lg"
          />
        </div>
      )}
    </>
  );
};

export default DoneModal;
