import mongoose from "mongoose";

const chatThreadSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

export const ChatThread = mongoose.models.ChatThread || mongoose.model("ChatThread", chatThreadSchema);
