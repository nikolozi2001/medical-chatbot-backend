const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const rateLimit = require("express-rate-limit");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { getChatReply } = require("./services/chatbot");

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 10, // limit each IP to 10 requests
  message: "Too many requests, please try again later.",
});

app.use(limiter);

// ✅ Correctly Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function getGeminiResponse(message) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" }); // ✅ Correct model name
    const result = await model.generateContent({ contents: [{ role: "user", parts: [{ text: message }] }] });
    
    if (!result || !result.candidates || result.candidates.length === 0) {
      throw new Error("No valid response from AI.");
    }

    return result.candidates[0].content.parts[0].text; // ✅ Extract response text correctly
  } catch (error) {
    console.error("🚨 Gemini API Error:", error.message || error);
    throw new Error("AI service unavailable. Please try again later.");
  }
}

// ✅ Chatbot API Route
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "Message is required." });

    const reply = await getGeminiResponse(message);
    res.json({ reply });
  } catch (error) {
    console.error("🚨 Error generating response:", error.message);

    // Fallback response if Gemini API fails
    try {
      const fallbackReply = getChatReply(req.body.message);
      res.json({ reply: fallbackReply });
    } catch (fallbackError) {
      console.error("🚨 Fallback response error:", fallbackError);
      res.status(500).json({ error: "Error generating response." });
    }
  }
});

app.listen(3000, () => console.log("✅ Server running on port 3000 🚀"));