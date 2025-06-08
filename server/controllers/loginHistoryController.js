import mongoose from "mongoose";
import LoginHistory from "../models/LoginHistory.js";
import User from "../models/User.js";
import Employee from "../models/Employee.js";
import Department from "../models/Department.js";
import departmentTimingRules from "../utils/departmentTimingRules.js";
import calculateStatus from "../utils/calculateStatus.js";

// Create or update login history
const createOrUpdateLoginHistory = async ({ userId, loginAt, logoutAt }) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid userId");
  }

  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const employee = await Employee.findOne({ userId }).populate("department");
  if (!employee) throw new Error("Employee not found");

  const depName =
    typeof employee.department === "object"
      ? employee.department.dep_name.toLowerCase()
      : employee.department.toLowerCase();

  const rules = departmentTimingRules[depName];
  if (!rules) {
    throw new Error(`No timing rules for department: ${depName}`);
  }

  const loginDate = loginAt ? new Date(loginAt) : null;
  const logoutDate = logoutAt ? new Date(logoutAt) : null;

  let recordDate = loginDate || logoutDate || new Date();
  if (rules.isNightShift) {
  if (loginDate && loginDate.getHours() < 12) {
    // Login between 12 AM to 11:59 AM → belongs to previous day's shift
    recordDate = new Date(loginDate);
    recordDate.setDate(recordDate.getDate() - 1);
  } else if (logoutDate && logoutDate.getHours() < 12) {
    // Logout in the morning, still belongs to previous day
    recordDate = new Date(logoutDate);
    recordDate.setDate(recordDate.getDate() - 1);
  }
}


  const localDate = new Date(recordDate);
const dateStr = localDate.toLocaleDateString("en-CA"); // yyyy-mm-dd

const dayStart = new Date(`${dateStr}T00:00:00`);
const dayEnd = new Date(`${dateStr}T23:59:59`);


  let history = await LoginHistory.findOne({
    userId,
    loginAt: { $gte: dayStart, $lte: dayEnd },
  });

  if (history) {
    if (loginDate && loginDate < history.loginAt) {
      history.loginAt = loginDate;
    }

    if (logoutDate && (!history.logoutAt || logoutDate > history.logoutAt)) {
      history.logoutAt = logoutDate;
    }

    history.status = calculateStatus(history.loginAt, rules, dateStr);
    history.username = user.username;
    history.department = depName;

    await history.save();
    return history;
  }

  const status = calculateStatus(loginDate, rules, dateStr);
  const newHistory = new LoginHistory({
    userId,
    username: user.username,
    department: depName,
    loginAt: loginDate,
    logoutAt: logoutDate,
    status,
  });

  await newHistory.save();
  return newHistory;
};

// Get login history by userId
const getLoginHistoryByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId format." });
    }

    const objectId = new mongoose.Types.ObjectId(userId);

    const loginHistory = await LoginHistory.find({ userId: objectId })
      .sort({ loginAt: -1 })
      .populate("userId", "username")
      .exec();

    if (!loginHistory.length) {
      return res.status(404).json({ message: "No login history found." });
    }

    const employee = await Employee.findOne({ userId: objectId }).populate(
      "department"
    );
    const depName = employee?.department?.dep_name || "Unknown";

    const formatted = loginHistory.map((entry) => {
      const loginDate = new Date(entry.loginAt);
      const logoutDate = entry.logoutAt ? new Date(entry.logoutAt) : null;

      return {
        username: entry.userId?.username || "Unknown",
        department: depName,
        date: loginDate.toISOString(),
        loginTime: loginDate.toISOString(),
        logoutTime: logoutDate ? logoutDate.toISOString() : null,
        status: entry.status || "Unknown",
      };
    });

    res.status(200).json({ data: formatted });
  } catch (error) {
    console.error("Error fetching login history:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Get login history by departmentId
const getLoginHistoryByDepartmentId = async (req, res) => {
  try {
    const { depId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(depId)) {
      return res.status(400).json({ message: "Invalid department ID." });
    }

    const department = await Department.findById(depId);
    if (!department || !department.dep_name) {
      return res.status(404).json({ message: "Department not found." });
    }

    const departmentName = department.dep_name;

    const loginHistory = await LoginHistory.find({
      department: new RegExp("^" + departmentName + "$", "i"),
    }).sort({ loginAt: -1 });

    if (!loginHistory.length) {
      return res.status(404).json({ message: "No login history found." });
    }

    const response = loginHistory.map((entry) => {
      const loginDate = new Date(entry.loginAt);
      const logoutDate = entry.logoutAt ? new Date(entry.logoutAt) : null;

      return {
        username: entry.username || "Unknown",
        department: entry.department || "Unknown",
        date: loginDate.toISOString(),
        loginTime: loginDate.toISOString(),
        logoutTime: logoutDate ? logoutDate.toISOString() : null,
        status: entry.status || "Unknown",
      };
    });

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching login history by department:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Edit login history entry by userId and date
const editLoginHistoryByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const { loginAt, logoutAt, date } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId format." });
    }

    if (!date) {
      return res.status(400).json({ message: "Date is required." });
    }

    const localDate = new Date(recordDate);
const dateStr = localDate.toLocaleDateString("en-CA"); // yyyy-mm-dd

const dayStart = new Date(`${dateStr}T00:00:00`);
const dayEnd = new Date(`${dateStr}T23:59:59`);


    const history = await LoginHistory.findOne({
      userId,
      loginAt: { $gte: dayStart, $lte: dayEnd },
    });

    if (!history) {
      return res
        .status(404)
        .json({ message: "Login history not found for the given date." });
    }

    const employee = await Employee.findOne({ userId }).populate("department");
    const depName = employee?.department?.dep_name?.toLowerCase();
    const rules = departmentTimingRules[depName];

    if (!rules) {
      return res
        .status(400)
        .json({ message: `Timing rules not found for department: ${depName}` });
    }

    if (loginAt) history.loginAt = new Date(loginAt);
    if (logoutAt) history.logoutAt = new Date(logoutAt);

    history.status = calculateStatus(history.loginAt, rules, dateStr);

    await history.save();
    return res
      .status(200)
      .json({ message: "Login history updated", data: history });
  } catch (error) {
    console.error("Error updating login history:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export {
  editLoginHistoryByUserId,
  getLoginHistoryByDepartmentId,
  getLoginHistoryByUserId,
  createOrUpdateLoginHistory,
};
