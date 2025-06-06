import mongoose from "mongoose";

const salesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    customer_name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    contact_no: {
      type: String,
      required: true,
      trim: true,
    },
    whatsapp_no: {
      type: String,
      trim: true,
    },
    domain_interested: {
      type: String,
      trim: true,
    },
    ticket_size: {
      type: Number,
      required: true,
    },
    registration_amount: {
      type: Number,
      required: true,
    },
    pending_amount: {
      type: Number,
      required: true,
    },
    pending_date: {
      type: Date,
    },
    program_type: {
      type: String,
      enum: ["Autonomous Learning", "Mentor Sync", "Accelerator"],
      required: true,
    },
    internship_start_date: {
      type: Date,
    },
    internship_end_date: {
      type: Date,
    },
    marketed_from: {
      type: String,
      trim: true,
    },
    target: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      immutable: true,
    },
  },
  {
    timestamps: false,
  }
);

const Sales = mongoose.model("Sales", salesSchema);

export default Sales;
