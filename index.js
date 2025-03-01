const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const rateLimit = require("express-rate-limit");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { getChatReply } = require("./services/chatbot");  // Import getChatReply

dotenv.config();

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not set in the environment variables.");
}

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 10, // limit each IP to 10 requests
  message: "Too many requests, please try again later.",
});

app.use(limiter);

// Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function getGeminiResponse(message) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent({ contents: [{ role: "user", parts: [{ text: message }] }] });

    console.log("🔮 Gemini AI Response:", result);
    
    if (!result || !result.candidates || result.candidates.length === 0) {
      throw new Error("No valid response from AI.");
    }

    return result.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("🚨 Gemini API Error:", error.message || error);
    throw new Error("AI service unavailable. Please try again later.");
  }
}

app.post("/chat", async (req, res, next) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "Message is required." });

    let reply;

    try {
      // Try getting predefined response
      reply = getChatReply(message);
    } catch (error) {
      // If no predefined response, fallback to Gemini API
      console.log("🔮 Fallback to Gemini API for response...");
      reply = await getGeminiResponse(message);
    }

    res.json({ reply });
  } catch (error) {
    console.error("🚨 Error generating response:", error.message);
    next(error);
  }
});

// Centralized error handling middleware
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message || "Error generating response." });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));