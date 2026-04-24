import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import chatRoute from "./routes/chat.js";
import taskRoute from "./routes/task.js";

/* 1. Load env FIRST */
dotenv.config();

/* 2. Create app */
const app = express();

/* 3. Middleware */
app.use(cors());
app.use(express.json());
app.use("/task", taskRoute);

/* 4. Routes */
app.use("/chat", chatRoute);

app.get("/", (req, res) => {
  res.send("FineTuneAI Backend Running");
});

/* 5. MongoDB connection */
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("Mongo error:", err));

/* 6. Start server */
app.listen(5000, () => {
  console.log("Server running on port 5000");
});