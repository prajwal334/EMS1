import React, { useState, useEffect } from "react";
import { PiCertificateBold } from "react-icons/pi";

const OpTable = () => {
  const [salesData, setSalesData] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
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
      .then((data) => setSalesData(data))
      .catch((err) => console.error("Fetch failed:", err));
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

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

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
    { label: "", width: 100, key: "actions", sticky: true },
  ];

  return (
    <div className="p-4 bg-white min-h-screen flex flex-col items-center">
      <div
        className="max-w-full bg-white rounded-lg w-full"
        style={{ maxWidth: "1200px" }}
      >
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

        <div className="overflow-x-auto max-h-[480px] relative">
          <table className="w-full" style={{ minWidth: "1200px" }}>
            <thead>
              <tr>
                {columns.map(({ label, width, sticky }) => (
                  <th
                    key={label + width}
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
                  <tr key={item._id}>
                    {/* SL NO. */}
                    <td
                      style={{
                        width: columns[0].width,
                        minWidth: columns[0].width,
                        padding: "8px",
                        textAlign: "center",
                        backgroundColor: "white",
                      }}
                    >
                      {(currentPage - 1) * itemsPerPage + idx + 1}
                    </td>

                    {/* Main data columns */}
                    {columns.slice(1, -1).map(({ key, width }) => {
                      let value = item[key];
                      if (
                        (key === "internship_start_date" ||
                          key === "internship_end_date") &&
                        value
                      ) {
                        value = new Date(value).toLocaleDateString("en-IN");
                      }
                      return (
                        <td
                          key={key}
                          style={{
                            width,
                            minWidth: width,
                            padding: "8px",
                            backgroundColor: "white",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {value || "-"}
                        </td>
                      );
                    })}

                    {/* Action column - Download certificate */}
                    <td
                      style={{
                        width: 100,
                        minWidth: 100,
                        position: "sticky",
                        right: 0,
                        backgroundColor: "#f3f4f6",
                        padding: "8px",
                        textAlign: "center",
                        zIndex: 5,
                      }}
                    >
                      <button
                        onClick={() =>
                          handleDownloadCertificate(
                            item._id,
                            item.customer_name
                          )
                        }
                        className="w-10 h-10 flex items-center justify-center bg-gray-600 text-white rounded-full hover:bg-gray-800"
                      >
                        <PiCertificateBold size={18} />
                      </button>
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
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded border"
          >
            Prev
          </button>
          {[...Array(totalPages).keys()].map((num) => (
            <button
              key={num + 1}
              onClick={() => handlePageChange(num + 1)}
              className={`px-3 py-1 rounded border ${
                currentPage === num + 1 ? "bg-gray-800 text-white" : ""
              }`}
            >
              {num + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
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
