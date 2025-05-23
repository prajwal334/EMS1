import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import LoginHistory from "../models/LoginHistory.js";

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, error: "User Not Found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: "Wrong Password" });
    }

    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "10d" }
    );

    // Save login history with employeeId
    await LoginHistory.create({
      userId: user._id,
      loginAt: new Date(),
    });

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

    // ✅ Use correct field: userId
    const lastLogin = await LoginHistory.findOne({
      userId: userId,
      logoutAt: null,
    }).sort({ loginAt: -1 });

    if (!lastLogin) {
      return res
        .status(400)
        .json({ success: false, error: "No active session found" });
    }

    lastLogin.logoutAt = new Date();
    await lastLogin.save();

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
