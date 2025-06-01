import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectToDatabase from "./db/db.js";

// Import routers
import authRouter from "./routes/auth.js";
import departmentRouter from "./routes/department.js";
import employeeRouter from "./routes/employee.js";
import salaryRouter from "./routes/salary.js";
import teamRouter from "./routes/team.js";
import leaveRouter from "./routes/leave.js";
import settingRouter from "./routes/setting.js";
import summaryRoutes from "./routes/summary.js";
import pfRouter from "./routes/pf.js";
import loginHistoryRoutes from "./routes/loginhistory.js";
import dashboardRouter from "./routes/dashboard.js";
import attendanceRoutes from "./routes/attendance.js";
import taskRoutes from "./routes/task.js";

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectToDatabase();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("public/uploads"));

// Routes
app.use("/api/auth", authRouter);
app.use("/api/department", departmentRouter);
app.use("/api/employee", employeeRouter);
app.use("/api/team", teamRouter);
app.use("/api/salary", salaryRouter);
app.use("/api/leave", leaveRouter);
app.use("/api/setting", settingRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/summary", summaryRoutes);
app.use("/api/pf", pfRouter);
app.use("/api/login-history", loginHistoryRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/task", taskRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
