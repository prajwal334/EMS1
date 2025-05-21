import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  username: { type: String, required: true },
  department: { type: String, required: true },
  date: { type: Date, required: true },
  loginTime: { type: String },
  logoutTime: { type: String },
  status: { type: String },
});

const Attendance = mongoose.model("Attendance", attendanceSchema);
export default Attendance;
