import React, { useState, useEffect, useRef } from "react";
import { PiCertificateBold } from "react-icons/pi";
import { FaCloudUploadAlt } from "react-icons/fa";
import { LiaCertificateSolid } from "react-icons/lia";

const OpTable = () => {
  const [salesData, setSalesData] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const fileInputRef = useRef({});
  const itemsPerPage = 10;

  useEffect(() => {
    fetchSalesData();
  }, []);

  const fetchSalesData = () => {
    fetch("http://localhost:3000/api/salestask")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => {
        const enrichedData = data.map((item) => ({
          ...item,
          image_url: item.upload_image
            ? `http://localhost:3000/uploads/image/${item.upload_image}`
            : null,
        }));

        const isDifferent =
          salesData.length !== enrichedData.length ||
          salesData.some(
            (item, i) =>
              item._id !== enrichedData[i]._id ||
              item.image_url !== enrichedData[i].image_url
          );

        if (isDifferent) {
          setSalesData(enrichedData);
        }
      })
      .catch((err) => console.error("Fetch failed:", err));
  };

  const handleUploadClick = (id) => {
    if (fileInputRef.current[id]) {
      fileInputRef.current[id].click();
    }
  };

  const handleFileChange = async (e, id) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("id", id);

      const res = await fetch(
        "http://localhost:3000/api/salestask/upload-image",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) throw new Error("Upload failed");

      const result = await res.json(); // Expected to return { image_url: "filename.jpg" }

      const updatedData = salesData.map((item) =>
        item._id === id
          ? {
              ...item,
              image_url: `http://localhost:3000/uploads/image/${result.image_url}`,
            }
          : item
      );
      setSalesData(updatedData);

      alert("Image uploaded successfully");
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed");
    }
  };

  const handleDownloadCertificate = async (id, name) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/certificate/generate/${id}`
      );
      if (!response.ok) throw new Error("Failed to generate certificate");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${name}_certificate.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", error);
      alert("Error downloading certificate");
    }
  };

  // New handler for internship certificate download
  const handleDownloadInternshipCertificate = async (id, name) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/internships/generate/${id}`
      );
      if (!response.ok)
        throw new Error("Failed to generate internship certificate");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${name}_internship_certificate.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", error);
      alert("Error downloading internship certificate");
    }
  };

  const filteredData = salesData.filter((item) => {
    const matchName = (item.customer_name || "")
      .toLowerCase()
      .includes(searchName.toLowerCase());
    const matchDate = searchDate
      ? new Date(item.createdAt).toLocaleDateString("en-CA") === searchDate
      : true;
    return matchName && matchDate;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentItems = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const columns = [
    { label: "SL NO.", width: 60 },
    { label: "NAME", width: 180, key: "customer_name" },
    { label: "EMAIL ADDRESS", width: 220, key: "email" },
    { label: "CONTACT NO.", width: 140, key: "contact_no" },
    { label: "WHATSAPP NO.", width: 140, key: "whatsapp_no" },
    { label: "DOMAIN INTERESTED", width: 180, key: "domain_interested" },
    { label: "PROGRAM TYPE", width: 180, key: "program_type" },
    {
      label: "INTERNSHIP START DATE",
      width: 180,
      key: "internship_start_date",
    },
    { label: "INTERNSHIP END DATE", width: 180, key: "internship_end_date" },
    { label: "", width: 140, key: "actions", sticky: true }, // widened to fit 3 buttons nicely
  ];

  return (
    <div className="p-4 bg-white min-h-screen flex flex-col items-center">
      <div className="w-full max-w-[1200px] bg-white rounded-lg">
        {/* Filters */}
        <div className="border-b border-gray-300 px-4 py-3 flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Search by Customer Name"
            value={searchName}
            onChange={(e) => {
              setSearchName(e.target.value);
              setCurrentPage(1);
            }}
            className="rounded-md p-2 w-48 border"
          />
          <input
            type="date"
            value={searchDate}
            onChange={(e) => {
              setSearchDate(e.target.value);
              setCurrentPage(1);
            }}
            className="rounded-md p-2 w-48 border"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto max-h-[480px] relative">
          <table className="w-full min-w-[1200px]">
            <thead>
              <tr>
                {columns.map(({ label, width, sticky }) => (
                  <th
                    key={label}
                    style={{
                      width,
                      minWidth: width,
                      position: "sticky",
                      top: 0,
                      ...(sticky ? { right: 0 } : {}),
                      backgroundColor: "#E5E7EB",
                      color: "#111827",
                      fontWeight: "500",
                      textAlign: "left",
                      padding: "8px",
                      zIndex: 10,
                    }}
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentItems.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="p-4 text-center text-gray-600"
                  >
                    No records found.
                  </td>
                </tr>
              ) : (
                currentItems.map((item, idx) => (
                  <tr
                    key={item._id}
                    style={{
                      backgroundColor: idx % 2 === 0 ? "white" : "#F9FAFB",
                    }}
                  >
                    <td className="text-center p-2">
                      {(currentPage - 1) * itemsPerPage + idx + 1}
                    </td>
                    {columns.slice(1, -1).map(({ key }) => {
                      let value = item[key];
                      if (
                        (key === "internship_start_date" ||
                          key === "internship_end_date") &&
                        value
                      ) {
                        value = new Date(value).toLocaleDateString("en-IN");
                      }
                      return (
                        <td key={key} className="p-2 truncate">
                          {value || "-"}
                        </td>
                      );
                    })}

                    {/* Action Buttons */}
                    <td className="sticky right-0 bg-gray-100 p-2 z-10">
                      <div className="flex gap-2 justify-center">
                        <input
                          type="file"
                          accept="image/*"
                          ref={(el) => (fileInputRef.current[item._id] = el)}
                          style={{ display: "none" }}
                          onChange={(e) => handleFileChange(e, item._id)}
                        />
                        <button
                          onClick={() => handleUploadClick(item._id)}
                          className="w-10 h-10 flex items-center justify-center bg-gray-600 text-white rounded-full hover:bg-blue-800 overflow-hidden"
                          title="Upload Image"
                        >
                          {item.image_url ? (
                            <img
                              src={item.image_url}
                              alt="uploaded"
                              className="w-full h-full object-cover rounded-full"
                            />
                          ) : (
                            <FaCloudUploadAlt size={18} />
                          )}
                        </button>
                        <button
                          onClick={() =>
                            handleDownloadCertificate(
                              item._id,
                              item.customer_name
                            )
                          }
                          className="w-10 h-10 flex items-center justify-center bg-gray-600 text-white rounded-full hover:bg-gray-800"
                          title="Download Certificate"
                        >
                          <PiCertificateBold size={18} />
                        </button>

                        {/* Internship Certificate Button */}
                        <button
                          onClick={() =>
                            handleDownloadInternshipCertificate(
                              item._id,
                              item.customer_name
                            )
                          }
                          className="w-10 h-10 flex items-center justify-center bg-gray-600 text-white rounded-full hover:bg-green-800"
                          title="Download Internship Certificate"
                        >
                          <LiaCertificateSolid size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="border-t px-4 py-3 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded border"
          >
            Prev
          </button>
          {[...Array(totalPages).keys()].map((num) => (
            <button
              key={num}
              onClick={() => setCurrentPage(num + 1)}
              className={`px-3 py-1 rounded border ${
                currentPage === num + 1 ? "bg-gray-800 text-white" : ""
              }`}
            >
              {num + 1}
            </button>
          ))}
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded border"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default OpTable;
