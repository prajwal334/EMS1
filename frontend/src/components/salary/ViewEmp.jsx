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
  const doc = new jsPDF("p", "mm", "a3");
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const logoImg = new Image();
  logoImg.src = logo;

  const totalAllowance = Object.values(salary.allowances || {}).reduce((a, b) => a + b, 0);
  const totalDeduction = Object.values(salary.deductions || {}).reduce((a, b) => a + b, 0);
  const netSalary = salary.netSalary;

  // -- Header with Logo
  // Logo
doc.addImage(logoImg, "PNG", 15, 15, 30, 30);

// Centered Title
doc.setFont("helvetica", "bold");
doc.setFontSize(20);
const title = "CENTRALIZED PAYROLL SYSTEM";
doc.text(title, pageWidth / 2 - doc.getTextWidth(title) / 2, 22);

// Centered Address (2 lines)
doc.setFont("helvetica", "normal");
doc.setFontSize(10);
const address1 = "Address: First floor, Neela paradise, 551, 60 Feet Rd, near kalaniketan, AECS Layout - A Block,";
const address2 = "AECS Layout, Singasandra, Bengaluru, Karnataka 560068";
doc.text(address1, pageWidth / 2 - doc.getTextWidth(address1) / 2, 28);
doc.text(address2, pageWidth / 2 - doc.getTextWidth(address2) / 2, 33);

// ------- Centered Block of Location + Branch --------
doc.setFont("helvetica", "bold");
doc.setFontSize(14);

const blockText = "SINGASANDRA, BANGALORE        BRANCH-2";
const blockWidth = doc.getTextWidth(blockText);
doc.text(blockText, pageWidth / 2 - blockWidth / 2, 45); // centered block

// ------- Below Line: Payslip For + Paid In --------
doc.setFont("helvetica", "normal");
doc.setFontSize(10);

const formatDate = (date) =>
  date ? new Date(date).toISOString().slice(0, 10) : "N/A";

const subBlockText = `PAYSLIP FOR ${formatDate(salary.payFrom)}        PAID IN ${formatDate(salary.payTo)}`;
const subBlockWidth = doc.getTextWidth(subBlockText);
doc.text(subBlockText, pageWidth / 2 - subBlockWidth / 2, 52);


  // ----------------- Boxed Fields Start -----------------

  let y = 62;
  const boxWidth = pageWidth - 30;

  // 🧾 Employee Info
  doc.rect(15, y, boxWidth, 15);
  doc.text(`NVKSH PERNO.: ${salary.employeeId?.nvkshPerno || "N/A"}`, 17, y + 5);
doc.text(`NVKSH UNIT PERNO.: ${salary.employeeId?.nvkshUnitPerno || "N/A"}`, 105, y + 5);
doc.text(`GRADE: ${salary.employeeId?.grade || "N/A"}`, pageWidth - 60, y + 5);
doc.text(`NAME: ${salary.employeeId?.name || "N/A"}`, 17, y + 11);
doc.text(`DESIGNATION: ${salary.employeeId?.designation || "N/A"}`, 105, y + 11);
doc.text(`PAN: ${salary.employeeId?.pan || "N/A"}`, pageWidth - 60, y + 11);

  y += 16;

  // 🏦 Bank, Attendance & Leave Details
doc.rect(15, y, boxWidth, 20); // Increased height for multi-line

// Line 1: Bank A/C and IFSC
doc.setFont("helvetica", "normal");
doc.text(`BANK A/C NO.: ${salary.employeeId?.bankac || "N/A"}`, 17, y + 6);
doc.text(`IFSC/BRANCH CODE: ${salary.employeeId?.ifsc || "N/A"}`, pageWidth / 2 + 10, y + 6);

// Line 2: EMP Location and Attendance
doc.setFont("helvetica", "bold");
doc.text("EMP LOCATION:", 17, y + 12);
doc.text("ATTENDANCE:", pageWidth / 2 + 10, y + 12);

doc.setFont("helvetica", "normal");
doc.text("BANGALORE", 50, y + 12);
doc.text(
  `DUTY 22   CL 2   SL 1   LOP ${salary.lopDays || 0}   LL ${salary.lateLogins || 0}`,
  pageWidth / 2 + 40,
  y + 12
);

// Line 3: Leave Balance
doc.setFont("helvetica", "bold");
doc.text("LEAVE BALANCE:", 17, y + 18);

doc.setFont("helvetica", "normal");
doc.text("CL 4   SL 3   EL 12", 60, y + 18);

// Adjust Y position for next section
y += 22;

  // 💰 Gross/Deduction/Net
  doc.rect(15, y, boxWidth, 10);
  doc.text(`GROSS PAY: ₹ ${totalAllowance.toFixed(2)}`, 17, y + 7);
  doc.text(`DEDUCTION: ₹ ${totalDeduction.toFixed(2)}`, 90, y + 7);
  doc.text(`NET PAY: ₹ ${netSalary.toFixed(2)}`, 180, y + 7);

  y += 16;

  // ----------------- Salary Details Section -----------------

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("SALARY DETAILS:", pageWidth / 2 - 30, y);
  y += 6;

  // Payment and Deduction Grid Boxes
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  const col1X = 60;
  const col2X = pageWidth / 2 + 20;
  const rowHeight = 10;
  const colW = 65;

  const earnings = [
    ["BASIC P", salary.basicSalary],
    ["HRA", salary.allowances.houseRent],
    ["MA", salary.allowances.medical],
    ["TA", salary.allowances.travel],
    ["FA", salary.allowances.food],
    ["Tr. A", salary.allowances.target],
    ["OT", salary.overtimeHours * 200],
    ["OT A", salary.allowances.overtimeAllowance],
  ];

  const deductions = [
    ["LCD", salary.deductions.lateLogin],
    ["LWP", salary.deductions.leaveOfAbsence],
    ["HD", salary.deductions.halfDay],
    ["TP", salary.deductions.targetPenalty],
    ["PF", salary.deductions.pf],
    ["LOAN", salary.deductions.loan],
    ["PT", salary.deductions.pt],
  ];

  // Earnings (Left Box)
  doc.setFont("helvetica", "bold");
  doc.text("PAYMENT:", col1X, y + 6);
  doc.text("DEDUCTION:", col2X, y + 6);
  doc.setFont("helvetica", "normal");

  y += 10;

  for (let i = 0; i < 8; i++) {
    const e = earnings[i] || ["", ""];
    const d = deductions[i] || ["", ""];

    // Left (Earnings)
    doc.rect(col1X, y, colW, rowHeight);
    doc.text(e[0], col1X + 3, y + 6);
    if (e[1] !== "") {
      doc.text(`₹ ${Number(e[1] || 0).toFixed(2)}`, col1X + 35, y + 6);
    }

    // Right (Deductions)
    doc.rect(col2X, y, colW, rowHeight);
    if (d[0]) doc.text(d[0], col2X + 3, y + 6);
    if (d[1] !== "") {
      doc.text(`₹ ${Number(d[1] || 0).toFixed(2)}`, col2X + 35, y + 6);
    }

    y += rowHeight;
  }

  // ----------------- Abbreviations -----------------
  y += 10;
  doc.setFont("helvetica", "bold");
  doc.text("ABBREVIATION:", col2X, y);
  y += 5;
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");

  const abbrev = [
    "BASIC P = BASIC PAY",
    "HRA = HOUSE RENT",
    "MA = MEDICAL ALLOWANCE",
    "TA = TRAVEL ALLOWANCE",
    "FA = FOOD ALLOWANCE",
    "Tr. A = TARGET ALLOWANCE",
    "OT = OVERTIME HOURS * 200",
    "OT A = OVERTIME ALLOWANCE",
    "LCD = LATE COMING DEDUCTION",
    "LWP = LEAVE WITHOUT PAY",
    "TP = TARGET PENALTY",
    "PF = PROVIDENT FUND",
    "PT = PROFESSIONAL TAX",
  ];

  abbrev.forEach((item, i) => {
    doc.text(item, col2X, y + i * 4);
  });


  // ----------------- Footer -----------------
  y += 80;

  doc.setFontSize(8);
    doc.text("NOTE:", 15, y);
    y += 6;
    doc.text("• Any additional deduction reflected under the Deductions column has been neutralized through a corresponding entry in the Earnings column, wherever applicable.", 15, y, { maxWidth: 250 });
    y += 4;
    doc.text("• All figures and entries mentioned in this payslip have been prepared and verified by the Finance Department.", 15, y, { maxWidth: 200 });
  y += 4;
  doc.text("• In case of any discrepancies or unusual entries, please contact the Finance Department at financedept@navikshaa.com for clarification.", 15, y, { maxWidth: 200 });
  y += 9;
  doc.text("• This is a computer-generated payslip and does not require a signature.", 15, y, { maxWidth: 200 });
  y += 4;
  doc.text("• For any queries, please reach out to the HR department ", 15, y, { maxWidth: 200 });


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
