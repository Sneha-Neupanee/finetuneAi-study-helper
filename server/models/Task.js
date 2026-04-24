import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  user: String,
  task: String,
  status: {
    type: String,
    default: "pending"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Task", taskSchema);