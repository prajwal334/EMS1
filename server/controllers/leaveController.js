import Employee from "../models/Employee.js";
import Leave from "../models/Leave.js";
import mongoose from "mongoose";

const addLeave = async (req, res) => {
  try {
    const { userId, leaveType, startDate, endDate, reason } = req.body;
    const employee = await Employee.findOne({ userId });

    console.log("leave");
    const newLeave = new Leave({
      employeeId: employee._id,
      leaveType,
      startDate,
      endDate,
      reason,
    });

    await newLeave.save();
    return res
      .status(201)
      .json({
        success: true,
        message: "Leave Added Successfully",
        leave: newLeave,
      });
  } catch (error) {
    console.error(error.message); // log full error, not just .message
    return res
      .status(500)
      .json({ success: false, error: "Leave add server Error " });
  }
};

const getLeave = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid ID" });

    }

    };
  
    const leaves = await Leave.find({ employeeId: id });
return res.status(200).json({ success: true, leaves: leaves || [] });

    const leaves = await Leave.find({ employeeId: id });
    return res.status(200).json({ success: true, leaves: leaves || [] });
  } catch (error) {
    console.error("getLeave error:", error);
    return res
      .status(500)
      .json({ success: false, error: "Leave get server Error" });
  }
};

const getLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find().populate({
      path: "employeeId",
      populate: [
        {
          path: "department",
          select: "dep_name",
        },
        {
          path: "userId",
          select: "name",
        },
      ],
    });
    return res.status(200).json({ success: true, leaves });
  } catch (error) {
    console.error(error.message); // log full error, not just .message
    return res
      .status(500)
      .json({ success: false, error: "Leave get server Error " });
  }
};

const getLeaveDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const leave = await Leave.findById({ _id: id }).populate({
      path: "employeeId",
      populate: [
        {
          path: "department",
          select: "dep_name",
        },
        {
          path: "userId",
          select: "name, profileImage",
        },
      ],
    });
    return res.status(200).json({ success: true, leave });
  } catch (error) {
    console.error(error.message); // log full error, not just .message
    return res
      .status(500)
      .json({ success: false, error: "Leave get serverz Error " });
  }
};

const updateLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const leave = await Leave.findByIdAndUpdate(
      { _id: id },
      { status: req.body.status }
    );
    if (!leave) {
      return res.status(404).json({ success: false, error: "Leave not found" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Leave updated successfully" });
  } catch (error) {
    console.error(error.message); // log full error, not just .message
    return res
      .status(500)
      .json({ success: false, error: "Leave update server Error " });
  }
};

const getLeavesByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const employee = await Employee.findOne({ userId });

    if (!employee) {
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });
    }

    const leaves = await Leave.find({ employeeId: employee._id });

    const filteredLeaves = leaves.map((leave) => ({
      _id: leave._id,
      status: leave.status,
      leaveType: leave.leaveType,
    }));

    return res.status(200).json({ success: true, leaves: filteredLeaves });
  } catch (error) {
    console.error("getLeavesByUserId error:", error);
    return res.status(500).json({
      success: false,
      error: "Server error while fetching leaves by userId",
    });
  }
};

export {
  addLeave,
  getLeave,
  getLeaves,
  getLeaveDetail,
  updateLeave,
  getLeavesByUserId,
};
