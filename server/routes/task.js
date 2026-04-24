import express from "express";
import Task from "../models/Task.js";

const router = express.Router();

// Add task
router.post("/add", async (req, res) => {
  const { user, task } = req.body;

  const newTask = new Task({ user, task });
  await newTask.save();

  res.json({ message: "Task added", task: newTask });
});

// Get tasks
router.get("/:user", async (req, res) => {
  const tasks = await Task.find({ user });
  res.json(tasks);
});

export default router;