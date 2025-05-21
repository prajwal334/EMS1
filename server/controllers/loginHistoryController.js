import mongoose from "mongoose";
import LoginHistory from "../models/LoginHistory.js";

// GET login history by userId (employee _id)
export const getLoginHistoryByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate the userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId format." });
    }

    const objectId = new mongoose.Types.ObjectId(userId);

    const loginHistory = await LoginHistory.find({ userId: objectId })
      .sort({ loginAt: -1 })
      .exec();

    if (!loginHistory.length) {
      return res.status(404).json({ message: "No login history found." });
    }

    res.status(200).json(loginHistory);
  } catch (error) {
    console.error("Error fetching login history:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
