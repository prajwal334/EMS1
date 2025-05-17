import mongoose from "mongoose";

const loginHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  loginAt: { type: Date, default: Date.now },
  logoutAt: { type: Date, default: null },
});

const LoginHistory = mongoose.model("LoginHistory", loginHistorySchema);
export default LoginHistory;
