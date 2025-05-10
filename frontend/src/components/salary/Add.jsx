import React, { useState, useEffect } from "react";
import { fetchDepartments, getEmployees } from "../../utils/EmployeeHelper";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Add = () => {
  const [salary, setSalary] = useState({
    employeeId: null,
    basicSalary: 0,
    allowances: 0,
    deductions: 0,
    payDate: null,
  });

  const [inputCounts, setInputCounts] = useState({
    overtimeHours: '',
    lopDays: '',
    lateLogins: '',
    halfDays: '',
  });

  const [allowanceFields, setAllowanceFields] = useState({
    houseRent: 0,
    medical: 0,
    travel: 0,
    food: 0,
    over: 0,
    target: 0,
    bonus: 0,
  });

  const [deductionFields, setDeductionFields] = useState({
    leaveOfAbsence: 0,
    lateLogin: 0,
    halfDay: 0,
    targetPenalty: 0,
    loan: 0,
    pf: 0,
  });

  const [departments, setDepartments] = useState(null);
  const [employees, setEmployees] = useState([]);
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
      const basicSalary = Math.floor(ctc / 12);
      setSalary((prevData) => ({
        ...prevData,
        employeeId: selectedEmp._id,
        basicSalary,
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSalary((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleInputCountChange = (e) => {
    const { name, value } = e.target;
    setInputCounts((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  useEffect(() => {
    const gross = salary.basicSalary;
    const perDay = gross / 30;

    // Allowances
    const houseRent = gross * 0.09;
    const medical = gross * 0.042;
    const travel = gross * 0.068;
    const food = gross * 0.10;
    const over = inputCounts.overtimeHours * 200;

    const newAllowances = {
      houseRent,
      medical,
      travel,
      food,
      over,
      bonus: allowanceFields.bonus || 0,
      target: allowanceFields.target || 0,
    };

    setAllowanceFields(newAllowances);
    const allowanceTotal = Object.values(newAllowances).reduce((acc, val) => acc + val, 0);

    // Deductions
    const leaveOfAbsence = perDay * inputCounts.lopDays;
    const lateLogin = 300 * inputCounts.lateLogins;
    const halfDay = (perDay / 2) * inputCounts.halfDays;
    const pf = gross * 0.10;

    const newDeductions = {
      leaveOfAbsence,
      lateLogin,
      halfDay,
      targetPenalty: deductionFields.targetPenalty || 0,
      loan: deductionFields.loan || 0,
      pf,
    };

    setDeductionFields(newDeductions);
    const deductionTotal = Object.values(newDeductions).reduce((acc, val) => acc + val, 0);

    setSalary((prev) => ({
      ...prev,
      allowances: allowanceTotal,
      deductions: deductionTotal,
    }));
  }, [salary.basicSalary, inputCounts]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `http://localhost:3000/api/salary/add`,
        salary,
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
      if (error.response && !error.response.data.success) {
        alert(error.response.data.error);
      }
    }
  };

  return (
    <>
      {departments ? (
        <div className="max-w-6xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md">
          <h2 className="text-2xl font-bold mb-6">Add Salary</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Department Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Department</label>
                <select
                  name="department"
                  onChange={handleDepartment}
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
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

              {/* Employee Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Employee</label>
                <select
                  name="employeeId"
                  onChange={handleEmployee}
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
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

              {/* Gross Pay */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Gross Pay</label>
                <input
                  type="number"
                  name="basicSalary"
                  value={salary.basicSalary}
                  readOnly
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                />
              </div>

              {/* Pay Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Pay Date</label>
                <input
                  type="date"
                  name="payDate"
                  onChange={handleChange}
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                  required
                />
              </div>
            </div>

            {/* Manual Inputs for Dynamic Calculations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {[
                { label: "Overtime Hours", name: "overtimeHours" },
                { label: "LOP Days", name: "lopDays" },
                { label: "Late Logins", name: "lateLogins" },
                { label: "Half Days", name: "halfDays" },
              ].map(({ label, name }) => (
                <div key={name}>
                  <label className="block text-sm font-medium text-gray-700">{label}</label>
                  <input
                    type="number"
                    name={name}
                    value={inputCounts[name]}
                    onChange={handleInputCountChange}
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                  />
                </div>
              ))}
            </div>

            {/* Auto-calculated Allowances */}
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-4">Allowances</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(allowanceFields).map(([key, value]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700">
                      {key.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase())}
                    </label>
                    <input
                      type="number"
                      value={value}
                      readOnly
                      className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Auto-calculated Deductions */}
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-4">Deductions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(deductionFields).map(([key, value]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700">
                      {key.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase())}
                    </label>
                    <input
                      type="number"
                      value={value}
                      readOnly
                      className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                    />
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-8 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded"
            >
              Add Salary
            </button>
          </form>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
};

export default Add;
