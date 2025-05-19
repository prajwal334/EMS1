import Salary from "../models/Salary.js";
import Employee from "../models/Employee.js";
import Department from "../models/Department.js";

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
      overtimeAllowance = 0,
      targetPenalty = 0,
      loan = 0,
      pt = 0,

      payDate,
      payFrom,
      payTo,
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
      overtimeAllowance: parseFloat(overtimeAllowance),
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
      pt: parseFloat(pt),
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
      payFrom,
      payTo,
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
    let salary = await Salary.find({ employeeId: id }).populate("employeeId");
    if(!salary || salary.length < 1){ 
      const employee = await Employee.findOne({userId: id});
      salary = await Salary.find({ employeeId: employee._id }).populate("employeeId");
    }
    return res.status(200).json({ success: true, salary });
  } catch(error) {
    return res.status(500).json({ success: false, error: "Salary get server error" });
  }
}

const getDepartmentWiseSalary = async (req, res) => {
  try {
    const year = parseInt(req.query.year);
    const month = parseInt(req.query.month); // optional

    let matchStage = {};

    if (year && month) {
      const startDate = new Date(year, month - 1, 1); // ✅ JS months are 0-indexed
      const endDate = new Date(year, month, 0, 23, 59, 59, 999); // ✅ last day of month
      matchStage = {
        payDate: { $gte: startDate, $lte: endDate },
        payFrom: { $gte: startDate, $lte: endDate },
        payTo: { $gte: startDate, $lte: endDate }
       

      };
    } else if (year) {
      const startDate = new Date(year, 0, 1);
      const endDate = new Date(year, 11, 31, 23, 59, 59, 999);
      matchStage = {
        payDate: { $gte: startDate, $lte: endDate },
        payFrom: { $gte: startDate, $lte: endDate },
        payTo: { $gte: startDate, $lte: endDate }
        

      };
    }

    const result = await Salary.aggregate([
      { $match: matchStage },
      {
        $lookup: {
          from: "employees",
          localField: "employeeId",
          foreignField: "_id",
          as: "employee"
        }
      },
      { $unwind: "$employee" },
      {
        $lookup: {
          from: "departments",
          localField: "employee.department",
          foreignField: "_id",
          as: "department"
        }
      },
      { $unwind: "$department" },
      {
        $group: {
          _id: "$department.dep_name",
          totalSalary: { $sum: "$netSalary" },
          avgSalary: { $avg: "$netSalary" },
          employeeCount: { $sum: 1 }
        }
      },
      {
        $project: {
          department: "$_id",
          totalSalary: 1,
          avgSalary: 1,
          employeeCount: 1,
          _id: 0
        }
      }
    ]);

    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    console.error("Error in department-wise salary aggregation:", err);
    return res.status(500).json({ success: false, error: "Server error while aggregating salary" });
  }
};




export { addSalary, getSalary, getDepartmentWiseSalary };
