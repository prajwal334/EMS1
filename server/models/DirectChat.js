// models/DirectChat.js
import mongoose from "mongoose";

const directChatSchema = new mongoose.Schema(
  {
    users: [ // ✅ Rename from "participants" to "users"
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("DirectChat", directChatSchema);
