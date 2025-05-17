import Department from "../models/Department.js";

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

export { addDepartment, getDepartments, deleteDepartment };
