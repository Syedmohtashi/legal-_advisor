//chatroutes.js
const express = require("express");
const axios = require("axios");
const Chat = require("../models/chat");
const authMiddleware = require("../middleware/auth");
require("dotenv").config();

const router = express.Router();

/**
 * POST /api/chat/ask
 * Body: { question: "<legal question>" }
 * Requires Authorization Header: Bearer <token>
 */
router.post("/chat/ask", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { question } = req.body;

    if (!question || typeof question !== "string") {
      return res.status(400).json({ error: "Valid question is required" });
    }

    const prompt = `You are a legal expert. Answer concisely:\n\n${question}`;

    // Hugging Face API Call
    const model = "mistralai/Mistral-7B-Instruct-v0.1";
    const apiUrl = `https://api-inference.huggingface.co/models/${model}`;
    const headers = {
      Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
      "Content-Type": "application/json",
    };

    const hfResponse = await axios.post(apiUrl, { inputs: prompt }, { headers });

    // Extract and sanitize AI response
    let generatedText = hfResponse.data?.[0]?.generated_text?.trim() || "";

    if (!generatedText || generatedText.includes("porn") || generatedText.length < 10) {
      console.error("⚠️ AI returned an invalid response:", generatedText);
      generatedText = "I'm sorry, but I couldn't find a reliable answer to your question. Please consult a legal expert.";
    }

    // Clean AI response (remove pre-prompt leaks)
    const cleanedAnswer = generatedText.replace(/^.*?\n/, "").trim();

    // Save to DB
    const chatEntry = new Chat({ user: userId, question, answer: cleanedAnswer });
    await chatEntry.save();

    res.json({ answer: cleanedAnswer, chatEntry });
  } catch (error) {
    console.error("❌ Error in /chat/ask:", error.message);
    res.status(500).json({ error: "AI service unavailable. Try again later.", details: error.message });
  }
});

module.exports = router;