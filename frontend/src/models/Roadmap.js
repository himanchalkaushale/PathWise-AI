import mongoose from "mongoose";

const roadmapSchema = new mongoose.Schema(
  {
    goal: { type: String, required: true },
    level: { type: String, default: "beginner" },
    title: { type: String, required: true },
    modules: { type: mongoose.Schema.Types.Mixed, default: [] },
    quiz_scores: { type: mongoose.Schema.Types.Mixed, default: {} },
    completed_lessons: { type: mongoose.Schema.Types.Mixed, default: [] },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

export const Roadmap = mongoose.models.Roadmap || mongoose.model("Roadmap", roadmapSchema);
