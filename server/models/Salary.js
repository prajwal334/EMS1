import mongoose from "mongoose";
import { Schema } from "mongoose";

const salarySchema = new Schema({
  employeeId: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
  basicSalary: { type: Number, required: true },

  allowances: {
    houseRent: { type: Number },
    medical: { type: Number },
    travel: { type: Number },
    food: { type: Number },
    overTime: { type: Number },
    bonus: { type: Number },
    target: { type: Number },
  },

  deductions: {
    leaveOfAbsence: { type: Number },
    lateLogin: { type: Number },
    halfDay: { type: Number },
    pf: { type: Number },
    targetPenalty: { type: Number },
    loan: { type: Number },
  },

  netSalary: { type: Number },

  overtimeHours: { type: Number },
  lopDays: { type: Number },
  payDate: { type: Date, required: true },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});


const Salary = mongoose.model('Salary', salarySchema);
export default Salary