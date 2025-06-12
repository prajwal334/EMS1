import multer from "multer";
import Employee from "../models/Employee.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import path from "path";
import Department from "../models/Department.js";
import mongoose from "mongoose";

// Multer storage setup
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

// Add Employee
const addEmployee = async (req, res) => {
  try {
    const {
      name,
      email,
      employeeId,
      bankname,
      bankacname,
      bankac,
      branchname,
      accountType,
      ifsc,
      nationality,
      hire,
      nvkshPerno,
      nvkshUnitPerno,
      phone,
      aadhar,
      permanentaddress,
      address1,
      address2,
      correspondenceAddress,
      correspondenceAddress1,
      correspondenceAddress2,
      grade,
      pan,
      doj,
      dob,
      status,
      gender,
      maritalStatus,
      designation,
      department,
      salary,
      password,
      role,
      username,
    } = req.body;

    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ success: false, error: "User already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      username,
      email,
      password: hashPassword,
      role,
      profileImage: req.file ? req.file.filename : null,
    });
    const savedUser = await newUser.save();

    const newEmployee = new Employee({
      userId: savedUser._id,
      name,
      email,
      employeeId,
      nvkshPerno,
      nvkshUnitPerno,
      grade,
      phone,
      pan,
      aadhar,
      permanentaddress,
      address1,
      address2,
      correspondenceAddress,
      correspondenceAddress1,
      correspondenceAddress2,
      bankname,
      bankacname,
      bankac,
      branchname,
      accountType,
      ifsc,
      hire,
      nationality,
      doj,
      dob,
      status,
      gender,
      maritalStatus,
      designation,
      department,
      salary,
      role,
      profileImage: req.file ? req.file.filename : null,
    });

    await newEmployee.save();
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

// Get all employees
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

// Get employee by id
const getEmployee = async (req, res) => {
  const { id } = req.params;
  try {
    let employee = await Employee.findById(id)
      .populate("userId", { password: 0 })
      .populate("department");
    if (!employee) {
      employee = await Employee.findOne({ userId: id })
        .populate("userId", { password: 0 })
        .populate("department");
    }
    if (!employee) {
      return res
        .status(404)
        .json({ success: false, error: "Employee not found" });
    }
    return res.status(200).json({ success: true, employee });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Getting Employee Server Error" });
  }
};

// Update employee
const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, maritalStatus, designation, department, salary, role } =
      req.body;

    const employee = await Employee.findById(id);
    if (!employee) {
      return res
        .status(404)
        .json({ success: false, error: "employee not found" });
    }
    const user = await User.findById(employee.userId);
    if (!user) {
      return res.status(404).json({ success: false, error: "user not found" });
    }

    const updateUser = await User.findByIdAndUpdate(employee.userId, { name });
    const updateEmployee = await Employee.findByIdAndUpdate(id, {
      maritalStatus,
      designation,
      salary,
      department,
      role,
    });

    if (!updateEmployee || !updateUser) {
      return res
        .status(404)
        .json({ success: false, error: "document not found" });
    }
    return res.status(200).json({ success: true, message: "employee updated" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "update employees server error" });
  }
};

// Fetch employees by department id
const fetchEmployeesByDepId = async (req, res) => {
  const { id } = req.params;
  try {
    const employees = await Employee.find({ department: id });
    return res.status(200).json({ success: true, employees });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "get employeesByDepId server error" });
  }
};

// Get department by user id
const getDepartmentByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
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

// Fetch users by role
const fetchUsersGroupedByRoleInDepartment = async (req, res) => {
  const { departmentId } = req.params;

  try {
    // Find all employees in the department
    const employees = await Employee.find({
      department: departmentId,
    }).populate("userId");

    // Group users by their roles
    const roleMap = {};

    for (const emp of employees) {
      const user = emp.userId;
      if (user && user.role) {
        if (!roleMap[user.role]) {
          roleMap[user.role] = [];
        }
        roleMap[user.role].push({
          _id: user._id,
          name: user.name,
          email: user.email,
          username: user.username,
          role: user.role,
          profileImage: user.profileImage,
          employeeId: emp._id,
        });
      }
    }

    return res.status(200).json({ success: true, roles: roleMap });
  } catch (error) {
    console.error("Error in fetchUsersGroupedByRoleInDepartment:", error);
    return res.status(500).json({
      success: false,
      error: "Server error in fetching users grouped by role",
    });
  }
};

const fetchUsersGroupedByDesignationInDepartment = async (req, res) => {
  const { departmentId } = req.params;
  const { role } = req.query; // get role from query string

  try {
    // Find all employees in the department
    const employees = await Employee.find({
      department: departmentId,
    }).populate("userId");

    // Group users by their designation
    const designationMap = {};

    for (const emp of employees) {
      const user = emp.userId;

      // Skip if user not found or role doesn't match (if role filter is provided)
      if (!user || (role && user.role !== role)) continue;

      const designation = emp.designation || "Unknown";
      if (!designationMap[designation]) {
        designationMap[designation] = [];
      }

      designationMap[designation].push({
        _id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        role: user.role,
        profileImage: user.profileImage,
        employeeId: emp._id,
      });
    }

    return res
      .status(200)
      .json({ success: true, designations: designationMap });
  } catch (error) {
    console.error(
      "Error in fetchUsersGroupedByDesignationInDepartment:",
      error
    );
    return res.status(500).json({
      success: false,
      error: "Server error in fetching users grouped by designation",
    });
  }
};

const fetchEmployeesByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    // Convert to ObjectId
    const objectUserId = new mongoose.Types.ObjectId(userId);

    // Query employees where userId matches
    const employees = await Employee.find({ userId: objectUserId })
      .populate("userId", { password: 0 })
      .populate("department");

    if (!employees || employees.length === 0) {
      return res.status(404).json({
        success: false,
        error: "No employees found for this userId",
      });
    }

    return res.status(200).json({ success: true, employees });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Server error fetching employees by userId",
    });
  }
};

const fetchEmployeesByDesignationName = async (req, res) => {
  try {
    const { name } = req.params;

    // Case-insensitive search for designation name
    const employees = await Employee.find({
      designation: { $regex: new RegExp(name, "i") },
    });

    res.status(200).json(employees);
  } catch (error) {
    console.error("Error fetching employees by designation name:", error);
    res.status(500).json({ message: "Failed to fetch employees" });
  }
};

export {
  addEmployee,
  upload,
  getEmployees,
  getEmployee,
  updateEmployee,
  fetchEmployeesByDepId,
  fetchEmployeesByUserId,
  getDepartmentByUserId,
  fetchUsersGroupedByRoleInDepartment,
  fetchUsersGroupedByDesignationInDepartment,
  fetchEmployeesByDesignationName,
};
