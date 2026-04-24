import express from "express";
import axios from "axios";
import Task from "../models/Task.js";

const router = express.Router();

/* 🧠 Personality / System Prompt */
const SYSTEM_PROMPT = `
You are an accountability coach chatbot.

Rules:
- Be strict, direct, and action-focused
- Do NOT over-empathize
- Do NOT encourage skipping tasks
- Always redirect user to action
- Keep responses short and practical
- Focus on execution, not emotions
- Remind user of unfinished tasks
`;

/* 🧠 MAIN CHAT ROUTE */
router.post("/", async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    /* 🧠 Step 1: Get user tasks from DB */
    const user = "sneha"; // later replace with auth system

    const tasks = await Task.find({ user });

    const taskContext =
      tasks.length > 0
        ? tasks
            .map((t, i) => `${i + 1}. ${t.task} - ${t.status}`)
            .join("\n")
        : "No tasks found.";

    /* 🧠 Step 2: Build AI prompt with memory */
    const prompt = `
${SYSTEM_PROMPT}

User Tasks:
${taskContext}

User Message:
${userMessage}

Coach:
`;

    /* 🧠 Step 3: Call Hugging Face */
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct",
      {
        inputs: prompt,
        parameters: {
          max_new_tokens: 200,
          return_full_text: false,
          temperature: 0.7
        }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`
        }
      }
    );

    /* 🧠 Step 4: Safe response handling */
    const data = response.data;

    // Model loading case
    if (data?.error) {
      return res.status(503).json({
        reply: "Model is loading. Please try again in a few seconds."
      });
    }

    let reply = "";

    if (Array.isArray(data)) {
      reply = data?.[0]?.generated_text || "";
    } else {
      reply = data?.generated_text || "";
    }

    /* 🧠 Step 5: fallback safety */
    if (!reply || reply.trim().length === 0) {
      reply = "I couldn't generate a response. Try again.";
    }

    /* 🧠 Step 6: send response */
    return res.json({
      reply: reply.trim(),
      tasks: tasks // optional: useful for frontend later
    });

  } catch (err) {
    console.error("AI Error:", err?.response?.data || err.message);

    return res.status(500).json({
      error: "AI service failed. Try again later."
    });
  }
});

export default router;