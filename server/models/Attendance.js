// models/Attendance.js
import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    userId: { 
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    employeeId: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    loginTime: {
      type: String,
    },
    logoutTime: {
      type: String,
    },
    status: {
      type: String,
      enum: ["Login", "Late Login", "Half Day", "Logout"],
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Attendance", attendanceSchema);
