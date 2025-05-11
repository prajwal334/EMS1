import Salary from "../models/Salary.js";

const addSalary = async (req, res) => {
  try {
    const {
      employeeId,
      grossPay,
      basicSalary,
      overtimeHours = 0,
      lopDays = 0,
      lateLogins = 0,
      halfDays = 0,
      targetAllowance = 0,
      bonus = 0,
      targetPenalty = 0,
      loan = 0,
      payDate,
    } = req.body;

    // Input validation
    if (!employeeId || !grossPay || !basicSalary || !payDate) {
      return res.status(400).json({
        success: false,
        error:
          "Missing required fields: employeeId, grossPay, basicSalary, payDate",
      });
    }

    const gross = parseFloat(grossPay);
    const basic = parseFloat(basicSalary);
    const perDay = gross / 30;

    // Allowances calculation
    const allowances = {
      houseRent: gross * 0.09,
      medical: gross * 0.042,
      travel: gross * 0.068,
      food: gross * 0.1,
      overTime: parseFloat(overtimeHours) * 200,
      bonus: parseFloat(bonus),
      target: parseFloat(targetAllowance),
    };

    const totalAllowances = Object.values(allowances).reduce(
      (sum, val) => sum + val,
      0
    );

    // Deductions calculation
    const deductions = {
      leaveOfAbsence: perDay * parseFloat(lopDays),
      lateLogin: parseFloat(lateLogins) * 300,
      halfDay: (perDay / 2) * parseFloat(halfDays),
      pf: basic * 0.1,
      targetPenalty: parseFloat(targetPenalty),
      loan: parseFloat(loan),
    };

    const totalDeductions = Object.values(deductions).reduce(
      (sum, val) => sum + val,
      0
    );

    const netSalary = basic + totalAllowances - totalDeductions;

    const newSalary = new Salary({
      employeeId,
      basicSalary: basic,
      allowances,
      deductions,
      netSalary,
      overtimeHours,
      lopDays,
      lateLogins,
      halfDays,
      bonus,
      targetAllowance,
      targetPenalty,
      loan,
      payDate,
    });

    await newSalary.save();

    return res.status(200).json({ success: true, salary: newSalary });
  } catch (error) {
    console.error("Salary add error:", error);
    return res
      .status(500)
      .json({ success: false, error: "Server error while adding salary" });
  }
};

const getSalary = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res
        .status(400)
        .json({ success: false, error: "Employee ID is required" });
    }

    const salary = await Salary.find({ employeeId: id }).populate(
      "employeeId",
      "employeeId name"
    );

    if (!salary || salary.length === 0) {
      return res.status(404).json({
        success: false,
        error: "No salary records found for this employee",
      });
    }

    return res.status(200).json({ success: true, salary });
  } catch (error) {
    console.error("Salary get error:", error);
    return res
      .status(500)
      .json({ success: false, error: "Server error while fetching salary" });
  }
};

export { addSalary, getSalary };
