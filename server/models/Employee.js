import mongoose from "mongoose";
import { Schema } from "mongoose";

const employeeSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  employeeId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  nvkshPerno: {
    type: Number,
    required: true,
    unique: true,
  },
  nvkshUnitPerno: {
    type: Number,
    required: true,
    unique: true,
  },
  grade: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
    unique: true,
  },
  pan: {
    type: String,
    required: true,
    unique: true,
  },
  aadhar: {
    type: Number,
    required: true,
    unique: true,
  },
  address: {
    type: String,
    required: true,
  },
  bankac: {
    type: Number,
    required: true,
  },
  bankname: {
    type: String,
    required: true,
  },
  bankacname: {
    type: String,
    required: true,
  },
  branchname: {
    type: String,
    required: true,
  },
  accountType: {
    type: String,
    enum: ["savings", "current"],
    required: true,
  },
  ifsc: {
    type: String,
    required: true,
  },
  doj: {
    type: Date,
  },
  gender: {
    type: String,
  },
  nationality: {
    type: String,
  },
  hire: {
    type: String,
  },
  maritalStatus: {
    type: String,
  },
  designation: {
    type: String,
  },
  department: {
    type: Schema.Types.ObjectId,
    ref: "Department",
    required: true,
  },
  salary: {
    type: Number,
    required: true,
  },
  profileImage: {
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Employee = mongoose.model("Employee", employeeSchema);
export default Employee;
