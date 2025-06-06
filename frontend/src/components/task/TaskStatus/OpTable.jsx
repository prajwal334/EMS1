import React, { useState, useEffect } from "react";

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
  ];

  return (
    <div className="p-4 bg-gray-100 min-h-screen flex flex-col items-center">
      <div
        className="max-w-full bg-white rounded-lg border border-gray-300 w-full"
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

        <div className="overflow-x-auto max-h-[480px]">
          <table
            className="w-full border-collapse"
            style={{ minWidth: "1200px" }}
          >
            <thead>
              <tr>
                {columns.map(({ label, width }) => (
                  <th
                    key={label}
                    style={{
                      width,
                      minWidth: width,
                      position: "sticky",
                      top: 0,
                      backgroundColor: "#2563EB",
                      color: "white",
                      border: "1px solid #1E40AF",
                      zIndex: 10,
                      textAlign: "left",
                      padding: "8px",
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
                    <td
                      style={{
                        width: columns[0].width,
                        minWidth: columns[0].width,
                        padding: "8px",
                        textAlign: "center",
                      }}
                    >
                      {(currentPage - 1) * itemsPerPage + idx + 1}
                    </td>

                    {columns.slice(1).map(({ key, width }) => {
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
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {value || "-"}
                        </td>
                      );
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

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
                currentPage === num + 1 ? "bg-blue-600 text-white" : ""
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
