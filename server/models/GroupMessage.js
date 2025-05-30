// models/GroupMessage.js
import mongoose from "mongoose";

const groupMessageSchema = new mongoose.Schema(
  {
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GroupChat",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reactions: [
  {
    emoji: String,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  }
],
    message: {
      type: String,
      default: "",
    },
    file: {
      type: String, // store file path if any
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("GroupMessage", groupMessageSchema);
