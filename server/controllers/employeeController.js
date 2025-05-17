import multer from "multer";
import Employee from "../models/Employee.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import path from "path";
import Department from "../models/Department.js";
import LoginHistory from "../models/LoginHistory.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
});

const addEmployee = async (req, res) => {
  try {
    const {
      name,
      email,
      employeeId,
      doj,
      gender,
      maritalStatus,
      designation,
      department,
      salary,
      password,
      role,
      username,
    } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ success: false, error: "User already exists" });
    }

    // Hash password
    const hashPassword = await bcrypt.hash(password, 10);

    // Create and save User
    const newUser = new User({
      name,
      username,
      email,
      password: hashPassword,
      role,
      profileImage: req.file ? req.file.filename : null,
    });
    const savedUser = await newUser.save();

    // Create and save Employee
    const newEmployee = new Employee({
      userId: savedUser._id,
      employeeId,
      doj,
      gender,
      maritalStatus,
      designation,
      department,
      salary,
    });
    const savedEmployee = await newEmployee.save();

    // Get department name for login history
    const departmentData = await Department.findById(department);

    return res
      .status(200)
      .json({ success: true, message: "Employee added successfully" });
  } catch (error) {
    console.error("Error in addEmployee:", error);
    return res
      .status(500)
      .json({ success: false, error: "Server Error in adding employee" });
  }
};

const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find()
      .populate("userId", { password: 0 })
      .populate("department");
    return res.status(200).json({ success: true, employees });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Getting Employees Server Error" });
  }
};

const getEmployee = async (req, res) => {
  const { id } = req.params;
  try {
    let employee = await Employee.findById({ _id: id })
      .populate("userId", { password: 0 })
      .populate("department");
    if (!employee) {
      employee = await Employee.findOne({ userId: id })
        .populate("userId", { password: 0 })
        .populate("department");
    }
    return res.status(200).json({ success: true, employee });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Getting Employees Server Error" });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, maritalStatus, designation, department, salary, role } =
      req.body;

    const employee = await Employee.findById({ _id: id });
    if (!employee) {
      return res
        .status(404)
        .json({ success: false, error: "employee not found" });
    }
    const user = await User.findById({ _id: employee.userId });
    if (!user) {
      return res.status(404).json({ success: false, error: "user not found" });
    }

    const updateUser = await User.findByIdAndUpdate(
      { _id: employee.userId },
      { name }
    );
    const updateEmployee = await Employee.findByIdAndUpdate(
      { _id: id },
      {
        maritalStatus,
        designation,
        salary,
        department,
        role,
      }
    );

    if (!updateEmployee || !updateUser) {
      return res
        .status(404)
        .json({ success: false, error: "document not found" });
    }
    return res.status(200).json({ success: true, message: "employee update" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "update employees server error" });
  }
};

const fetchEmployeesByDepId = async (req, res) => {
  const { id } = req.params;
  try {
    const employees = await Employee.find({ department: id });
    return res.status(200).json({ success: true, employees });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "get employeesbyDepId server error" });
  }
};

const getDepartmentByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    // Find employee by userId field and populate department
    const employee = await Employee.findOne({ userId }).populate("department");

    if (!employee) {
      return res
        .status(404)
        .json({ success: false, error: "Employee not found" });
    }

    if (!employee.department) {
      return res
        .status(404)
        .json({ success: false, error: "Department not found for employee" });
    }

    return res
      .status(200)
      .json({ success: true, department: employee.department });
  } catch (error) {
    console.error("Error in getDepartmentByUserId:", error);
    return res
      .status(500)
      .json({ success: false, error: "Server error in fetching department" });
  }
};

export {
  addEmployee,
  upload,
  getEmployees,
  getEmployee,
  updateEmployee,
  fetchEmployeesByDepId,
  getDepartmentByUserId,
};
