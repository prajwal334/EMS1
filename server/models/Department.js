import mongoose from "mongoose";

const subDepartmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

const departmentSchema = new mongoose.Schema({
  dep_name: { type: String, required: true },
  description: { type: String },
  employeeCount: { type: Number, default: 0 },
  sub_departments: [subDepartmentSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Department = mongoose.model("Department", departmentSchema);
export default Department;
