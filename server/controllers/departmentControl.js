import Department from "../models/Department.js";
import Employee from "../models/Employee.js";

const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find();
    return res.status(200).json({ success: true, departments });
  } catch (error) {
    return res.status(500).json({ success: false, error: "Server Error" });
  }
};

const addDepartment = async (req, res) => {
  try {
    const { dep_name, description } = req.body;
    const newDep = new Department({
      dep_name,
      description,
    });
    await newDep.save();
    return res.status(201).json({
      success: true,
      message: "Department Added Successfully",
      department: newDep,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: "Server Error" });
  }
};

const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedDep = await Department.findByIdAndDelete(id);
    if (!deletedDep) {
      return res
        .status(404)
        .json({ success: false, error: "Department not found" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Department deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, error: "Server Error" });
  }
};
const getDepartmentsWithEmployeeCount = async (req, res) => {
  try {
    const departments = await Department.aggregate([
      {
        $lookup: {
          from: "employees", // MongoDB collection name
          localField: "_id",
          foreignField: "department",
          as: "employees",
        },
      },
      {
        $project: {
          dep_name: 1,
          employeeCount: { $size: "$employees" },
        },
      },
    ]);

    return res.status(200).json({ success: true, departments });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Error fetching departments with employee count",
    });
  }
};

export { addDepartment, getDepartments, deleteDepartment,getDepartmentsWithEmployeeCount };
