import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import logo from "../../assets/images/logo1.png"
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const View = () => {
  const [salaries, setSalaries] = useState(null);
  const [filteredSalaries, setFilteredSalaries] = useState(null);
  const { id } = useParams();
  let sno = 1;

  const fetchSalaries = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/salary/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.success) {
        setSalaries(response.data.salary);
        setFilteredSalaries(response.data.salary);
      }
    } catch (error) {
      console.error("Error fetching salaries:", error);
    }
  };

  useEffect(() => {
    fetchSalaries();
  }, []);

  const filterSalaries = (e) => {
    const query = e.target.value;
    const filteredRecords = salaries.filter((salary) =>
      salary.employeeId?.employeeId
        ?.toLowerCase()
        .includes(query.toLowerCase())
    );
    setFilteredSalaries(filteredRecords);
  };

  const handleDownloadPDF = (salary) => {
    const doc = new jsPDF("p", "mm", "a4");
    const logoImg = new Image();
    logoImg.src = logo;

    const signImg = new Image();
    signImg.src = logo;

    const totalAllowance = Object.values(salary.allowances || {}).reduce((a, b) => a + b, 0);
    const totalDeduction = Object.values(salary.deductions || {}).reduce((a, b) => a + b, 0);
    const netSalary = salary.netSalary;

    let y = 20;
    doc.addImage(logoImg, "PNG", 15, y, 40, 15);
    y += 25;

    doc.setFontSize(14);
    doc.text("NAVIKSHAA TECHNOLOGIES LLP", 60, y);
    y += 7;
    doc.setFontSize(11);
    doc.text("CENTRALIZED PAYROLL SYSTEM", 60, y);
    y += 5;
    doc.text("SINGASANDRA, BANGALORE        BRANCH-2", 60, y);
    y += 10;

    doc.setFontSize(10);
    doc.text(`NVKSH PERNO.: ${salary.employeeId?.employeeId || "N/A"}`, 15, y);
    y += 6;
    doc.text(`NAME: ${salary.employeeId?.name || "N/A"}`, 15, y);
    y += 6;
    doc.text(`DESIGNATION: ${salary.employeeId?.designation || "N/A"}    PAN: ${salary.employeeId?.pan || "N/A"}`, 15, y);
    y += 6;
    doc.text(`PAYSLIP FOR: ${new Date(salary.payDate).toLocaleDateString()}    PAID IN: ${new Date().toLocaleDateString()}`, 15, y);
    y += 6;
    doc.text(`BANK A/C NO.: ${salary.employeeId?.bankAcc || "N/A"}    IFSC: ${salary.employeeId?.ifsc || "N/A"}`, 15, y);
    y += 6;
    doc.text(`EMP LOCATION: Bangalore    GRADE: A`, 15, y);
    y += 6;
    doc.text(`ATTENDANCE: DUTY 22  CL 2  SL 1  LOP ${salary.lopDays || 0}  LL ${salary.lateLogins || 0}`, 15, y);
    y += 6;
    doc.text(`LEAVE BALANCE: CL 4  SL 3  EL 12`, 15, y);
    y += 8;

    const earnings = [
      ["BASIC P", salary.basicSalary],
      ["HRA", salary.allowances.houseRent],
      ["MA", salary.allowances.medical],
      ["TA", salary.allowances.travel],
      ["FA", salary.allowances.food],
      ["Target A", salary.allowances.target],
      ["OT", salary.overtimeHours * 200],
      ["OT A", salary.allowances.overTime],
      ["", ""],
    ];

    const deductions = [
      ["LLD", salary.deductions.lateLogin],
      ["LOP", salary.deductions.leaveOfAbsence],
      ["Target P", salary.deductions.targetPenalty],
      ["PF", salary.deductions.pf],
      ["Loan", salary.deductions.loan],
      ["PT", 0],
      ["", ""],
      ["", ""],
      ["", ""],
    ];

    autoTable(doc, {
  head: [["EARNINGS", "AMOUNT", "DEDUCTIONS", "AMOUNT"]],
  body: earnings.map((e, i) => [
    e[0],
    `₹ ${Number(e[1] || 0).toFixed(2)}`,
    deductions[i]?.[0] || "",
    `₹ ${Number(deductions[i]?.[1] || 0).toFixed(2)}`
  ]),
  startY: y,
  styles: { fontSize: 10 },
  columnStyles: {
    0: { cellWidth: 40 },
    1: { cellWidth: 30 },
    2: { cellWidth: 40 },
    3: { cellWidth: 30 },
  },
});


    y = doc.lastAutoTable.finalY + 10;

    doc.setFontSize(11);
    doc.text(`GROSS PAY: ₹ ${totalAllowance.toFixed(2)}`, 15, y);
    doc.text(`DEDUCTION: ₹ ${totalDeduction.toFixed(2)}`, 90, y);
    doc.text(`NET PAY: ₹ ${netSalary.toFixed(2)}`, 160, y);
    y += 10;

    doc.setFontSize(9);
    doc.text(
      "Address: First floor, Neela paradise, 551, 60 Feet Rd, near kalaniketan, AECS Layout - A Block, AECS Layout, Singasandra, Bengaluru, Karnataka 560068",
      15,
      y,
      { maxWidth: 180 }
    );
    y += 12;

    doc.setFontSize(8);
    doc.text("NOTE:", 15, y);
    y += 4;
    doc.text("Any additional deduction has been neutralized through a corresponding earning entry.", 15, y, { maxWidth: 180 });
    y += 6;
    doc.text("All figures are verified by Finance. For concerns, contact: financedept@navikshaa.com", 15, y, { maxWidth: 180 });

    y += 15;
    doc.addImage(signImg, "PNG", 150, y, 40, 15);
    y += 5;
    doc.text("Authorized Signatory", 155, y + 15);

    doc.save(`Payslip_${salary.employeeId?.employeeId}_${salary._id}.pdf`);
  };

  if (!filteredSalaries) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="overflow-x-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-6">Salary Details</h2>

      <div className="flex justify-end mb-4">
        <input
          type="text"
          placeholder="Search by Employee ID"
          className="border border-gray-300 rounded-md px-3 py-1 text-sm"
          onChange={filterSalaries}
        />
      </div>

      {filteredSalaries.length > 0 ? (
        <table className="w-full text-sm text-left border border-gray-300 rounded-md shadow-md">
          <thead className="text-sm text-gray-700 uppercase bg-gray-50 border border-gray-300">
            <tr>
              <th className="px-6 py-3">SNo</th>
              <th className="px-6 py-3">Emp ID</th>
              <th className="px-6 py-3">Basic Salary</th>
              <th className="px-6 py-3">Total Allowance</th>
              <th className="px-6 py-3">Total Deduction</th>
              <th className="px-6 py-3">Net Salary</th>
              <th className="px-6 py-3">Pay Date</th>
              <th className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredSalaries.map((salary) => {
              const totalAllowance = Object.values(salary.allowances || {}).reduce((a, b) => a + b, 0);
              const totalDeduction = Object.values(salary.deductions || {}).reduce((a, b) => a + b, 0);
              return (
                <tr key={salary._id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-3">{sno++}</td>
                  <td className="px-6 py-3">{salary.employeeId?.employeeId || "N/A"}</td>
                  <td className="px-6 py-3">₹ {salary.basicSalary.toFixed(2)}</td>
                  <td className="px-6 py-3">₹ {totalAllowance.toFixed(2)}</td>
                  <td className="px-6 py-3">₹ {totalDeduction.toFixed(2)}</td>
                  <td className="px-6 py-3">₹ {salary.netSalary.toFixed(2)}</td>
                  <td className="px-6 py-3">{new Date(salary.payDate).toLocaleDateString()}</td>
                  <td className="px-6 py-3">
                    <button
                      onClick={() => handleDownloadPDF(salary)}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                    >
                      Download PDF
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <div className="text-center text-gray-600 mt-10">No salary records found.</div>
      )}
    </div>
  );
};

export default View;
