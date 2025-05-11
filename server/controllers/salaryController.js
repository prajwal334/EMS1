import Salary from "../models/Salary.js";

const addSalary = async (req, res) => {
  try {
    const {
      employeeId,
      grossPay,
      basicSalary,
      overtimeHours,
      lopDays,
      lateLogins,
      halfDays,
      targetAllowance = 0,
      bonus = 0,
      targetPenalty = 0,
      loan = 0,

      payDate,
    } = req.body;

    const gross = parseFloat(grossPay);
    const basic = parseFloat(basicSalary);
    const perDay = gross / 30;

    // Calculate Allowances
    const allowances = {
      houseRent: gross * 0.09,
      medical: gross * 0.042,
      travel: gross * 0.068,
      food: gross * 0.1,
      overTime: overtimeHours * 200,
      bonus: parseFloat(bonus),
      target: parseFloat(targetAllowance),
    };

    const totalAllowances = Object.values(allowances).reduce((sum, val) => sum + val, 0);

    // Calculate Deductions
    const deductions = {
      leaveOfAbsence: perDay * lopDays,
      lateLogin: lateLogins * 300,
      halfDay: (perDay / 2) * halfDays,
      pf: basic * 0.10,
      targetPenalty: parseFloat(targetPenalty),
      loan: parseFloat(loan),
    };

    const totalDeductions = Object.values(deductions).reduce((sum, val) => sum + val, 0);

    const netSalary = basic + totalAllowances - totalDeductions;

    const newSalary = new Salary({
      employeeId,
      basicSalary: basic,
      allowances: allowances,   
      deductions: deductions,   
      netSalary,
      overtimeHours,
      lopDays,
      payDate,
    });

    await newSalary.save();

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Salary add server error" });
  }
};

const getSalary = async (req, res) => {
  try {
    const { id } = req.params;
    const salary = await Salary.find({ employeeId: id }).populate("employeeId", "employeeId");
    return res.status(200).json({ success: true, salary });
  } catch (error) {
    return res.status(500).json({ success: false, error: "Salary get server error" });
  }
};



export { addSalary, getSalary };
