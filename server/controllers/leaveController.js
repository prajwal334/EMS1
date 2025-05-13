import Employee from "../models/Employee.js";
import Leave from "../models/Leave.js";

const  addLeave = async (req, res) => {
    try {
        const { userId,  leaveType, startDate, endDate, reason } = req.body;
        const employee = await Employee.findOne({userId});

        console.log("leave")
        const newLeave = new Leave({
            employeeId : employee._id,
            leaveType,
            startDate,
            endDate,
            reason
        });

        await newLeave.save();
        return res.status(201).json({ success: true, message: "Leave Added Successfully", leave: newLeave });
    } catch (error) {
        console.error(error.message); // log full error, not just .message
        return res.status(500).json({ success: false, error: "Leave add server Error " });
    }
}

const getLeaves = async (req, res) => {
    try {
        const { id } = req.params;
        const employee = await Employee.findOne({ userId: id });

        const leaves = await Leave.find({ employeeId: employee._id }).populate("employeeId", { password: 0 });
        return res.status(200).json({ success: true, leaves });
    } catch (error) {
        console.error(error.message); // log full error, not just .message
        return res.status(500).json({ success: false, error: "Leave get server Error " });
    }
}

export { addLeave, getLeaves };