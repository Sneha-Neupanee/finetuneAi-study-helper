import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import chatRoute from "./routes/chat.js";
import taskRoute from "./routes/task.js";

dotenv.config();

const app = express();

/* Middleware */
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());

/* Routes */
app.use("/task", taskRoute);
app.use("/chat", chatRoute);

app.get("/", (req, res) => {
  res.send("FineTuneAI Backend Running");
});

/* MongoDB + Server */
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");

    app.listen(5000, () => {
      console.log("Server running on port 5000");
    });
  })
  .catch(err => console.log("Mongo error:", err));