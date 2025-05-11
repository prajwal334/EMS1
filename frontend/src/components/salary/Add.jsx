import React, { useState, useEffect } from "react";
import { fetchDepartments, getEmployees } from "../../utils/EmployeeHelper";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Add = () => {
  const [salary, setSalary] = useState({
    employeeId: null,
    grossPay: 0,
    basicSalary: 0,
    payDate: "",
    overtimeHours: 0,
    lopDays: 0,
    lateLogins: 0,
    halfDays: 0,
    targetAllowance: 0,
    bonus: 0,
    targetPenalty: 0,
    loan: 0,
  });

  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [calculated, setCalculated] = useState({
    allowances: {},
    deductions: {},
    netSalary: 0,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const getDepartments = async () => {
      const departments = await fetchDepartments();
      setDepartments(departments);
    };
    getDepartments();
  }, []);

  const handleDepartment = async (e) => {
    const emps = await getEmployees(e.target.value);
    setEmployees(emps);
  };

  const handleEmployee = (e) => {
    const selectedEmpId = e.target.value;
    const selectedEmp = employees.find((emp) => emp._id === selectedEmpId);
    if (selectedEmp) {
      const ctc = selectedEmp.salary || 0;
      const grossPay = Math.floor(ctc / 12);
      const basicSalary = grossPay * 0.7;
      setSalary((prev) => ({
        ...prev,
        employeeId: selectedEmp._id,
        grossPay,
        basicSalary,
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const parsedValue = name === "payDate" ? value : parseFloat(value) || 0;
    setSalary((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));
  };

  useEffect(() => {
    const gross = salary.grossPay;
    const basic = salary.basicSalary;
    const perDay = gross / 30;

    const allowances = {
      houseRent: gross * 0.09,
      medical: gross * 0.042,
      travel: gross * 0.068,
      food: gross * 0.1,
      overTime: salary.overtimeHours * 200,
      bonus: salary.bonus,
      target: salary.targetAllowance,
    };

    const deductions = {
      pf: gross * 0.1,
      leaveOfAbsence: perDay * salary.lopDays,
      lateLogin: salary.lateLogins * 300,
      halfDay: (perDay / 2) * salary.halfDays,
      targetPenalty: salary.targetPenalty,
      loan: salary.loan,
    };

    const totalAllowances = Object.values(allowances).reduce(
      (sum, val) => sum + val,
      0
    );
    const totalDeductions = Object.values(deductions).reduce(
      (sum, val) => sum + val,
      0
    );
    const netSalary = basic + totalAllowances - totalDeductions;

    setCalculated({ allowances, deductions, netSalary });
  }, [salary]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/api/salary/add",
        {
          ...salary,
          netSalary: calculated.netSalary,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.success) {
        navigate("/admin-dashboard/employees");
      }
    } catch (error) {
      alert(error?.response?.data?.error || "Server error");
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-6">Add Salary</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Department
            </label>
            <select
              name="department"
              onChange={handleDepartment}
              className="mt-1 p-2 w-full border rounded"
              required
            >
              <option value="">Select Department</option>
              {departments.map((dep) => (
                <option key={dep._id} value={dep._id}>
                  {dep.dep_name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Employee
            </label>
            <select
              name="employeeId"
              onChange={handleEmployee}
              className="mt-1 p-2 w-full border rounded"
              required
            >
              <option value="">Select Employee</option>
              {employees.map((emp) => (
                <option key={emp._id} value={emp._id}>
                  {emp.employeeId}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Gross Pay
            </label>
            <input
              type="number"
              name="grossPay"
              value={salary.grossPay}
              readOnly
              className="mt-1 p-2 w-full border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Basic Salary
            </label>
            <input
              type="number"
              name="basicSalary"
              value={salary.basicSalary}
              readOnly
              className="mt-1 p-2 w-full border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Pay Date
            </label>
            <input
              type="date"
              name="payDate"
              value={salary.payDate}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded"
              required
            />
          </div>

          {/* Add other dynamic input fields */}
          {[
            "overtimeHours",
            "lopDays",
            "lateLogins",
            "halfDays",
            "targetAllowance",
            "bonus",
            "targetPenalty",
            "loan",
          ].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700">
                {field}
              </label>
              <input
                type="number"
                name={field}
                value={salary[field]}
                onChange={handleChange}
                className="mt-1 p-2 w-full border rounded"
              />
            </div>
          ))}

          <div className="md:col-span-2 mt-4">
            <p>
              <strong>Net Salary:</strong> ₹{calculated.netSalary.toFixed(2)}
            </p>
          </div>
        </div>

        <button
          type="submit"
          className="w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded"
        >
          Add Salary
        </button>
      </form>
    </div>
  );
};

export default Add;
