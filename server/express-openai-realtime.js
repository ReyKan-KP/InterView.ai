const express = require("express");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const router = express.Router();
require("dotenv").config();

let interviewType = "";
let position = "";

// Handler function for creating OpenAI session
async function createOpenAISession(req, res) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not set");
    }

    try {
      const { interviewType: it, position: pos } = req.body;
      if (it) interviewType = it;
      if (pos) position = pos;
    } catch (err) {
      console.log("Using default interview settings");
    }

    const response = await fetch("https://api.openai.com/v1/realtime/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-realtime-preview-2024-12-17",
        voice: "alloy",
        modalities: ["audio", "text"],
        instructions: `You are an expert interviewer for ${position} positions. Conduct a professional interview for this role, asking relevant technical and behavioral questions. 
          
Start by introducing yourself as InterView AI and explain that you'll be conducting a ${interviewType} interview for a ${position} position. Ask questions one at a time and wait for complete responses before proceeding to the next question.

Adapt your questions based on the candidate's responses to create a natural interview flow. Provide brief feedback after their answers when appropriate. 

Use the available tools when relevant, especially for technical demonstrations or to record significant feedback. 

End the interview by thanking them for their time and explaining that they'll receive feedback on their performance.`,
        tool_choice: "auto",
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI request failed: ${errorText}`);
    }

    const data = await response.json();

    return res.json({
      client_secret: { value: data.client_token },
      ...data,
    });
  } catch (error) {
    console.error("Failed to create OpenAI session:", error.message);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
}

// Route for '/api/session'
router.post("/api/session", createOpenAISession);

// Also make the endpoint available at root path for flexibility
router.post("/", createOpenAISession);

module.exports = router;
