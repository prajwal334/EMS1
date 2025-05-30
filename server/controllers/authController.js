import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import LoginHistory from "../models/LoginHistory.js";

const TIMEZONE = "Asia/Kolkata"; // Set your preferred timezone

// Login Controller
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, error: "User Not Found" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: "Wrong Password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "10d" }
    );

    // Check if a login record already exists for today
    const now = new Date();
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const existing = await LoginHistory.findOne({
      userId: user._id,
      loginAt: { $gte: todayStart, $lte: todayEnd },
    });

    // Only create login record if not already logged in today
    if (!existing) {
      await LoginHistory.create({
        userId: user._id,
        loginAt: new Date().toLocaleString("en-US", { timeZone: TIMEZONE }),
      });
    }

    res.status(200).json({
      success: true,
      message: "Login Successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        role: user.role,
        firstLogin: user.firstLogin,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

// Logout Controller
const logout = async (req, res) => {
  try {
    const userId = req.user._id;

    // Define today's time range
    const now = new Date();
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // Find today's login record
    const loginRecord = await LoginHistory.findOne({
      userId,
      loginAt: { $gte: todayStart, $lte: todayEnd },
    }).sort({ loginAt: -1 });

    if (!loginRecord) {
      return res.status(400).json({
        success: false,
        error: "No active session found for today",
      });
    }

    // Update logout time with local time string
    loginRecord.logoutAt = new Date().toLocaleString("en-US", {
      timeZone: TIMEZONE,
    });
    await loginRecord.save();

    res.status(200).json({ success: true, message: "Logout time recorded" });
  } catch (error) {
    console.error("Logout Error:", error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

// Verify Controller
const verify = (req, res) => {
  return res.status(200).json({ success: true, user: req.user });
};

export { login, logout, verify };
