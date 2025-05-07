import Department from "../models/Department.js";

const getDepartments = async (req, res) => {
    try {
        const departments = await Department.find();
        return res.status(200).json({ success: true, departments });
    } catch (error) {
        return res.status(500).json({ success: false, error: "Server Error" });
    }
}

const addDepartment = async (req,res) => {
    try {
        const {dep_name, description } = req.body;
        const newDep = new Department({
            dep_name,
            description
        });
        await newDep.save();
        return res.status(201).json({ success: true, message: "Department Added Successfully", Department: newDep });
    } catch (error) {
        return res.status(500).json({ success: false, error: "Server Error" });
    }
}

export { addDepartment, getDepartments }