const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const rateLimit = require("express-rate-limit");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { getChatReply } = require("./services/chatbot"); // Fallback response function

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

const limiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 10, // limit each IP to 10 requests per window
    message: "Too many requests, please try again later."
});

app.use(limiter);

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function getGeminiResponse(message) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(message);
        return result.response.text();
    } catch (error) {
        console.error("Gemini API Error:", error.message || error);
        throw new Error("AI service unavailable. Please try again later.");
    }
}

// Chatbot API Route
app.post("/chat", async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ error: "Message is required" });

        const reply = await getGeminiResponse(message);
        res.json({ reply });
    } catch (error) {
        console.error("Error generating response:", error.message);

        // Fallback response if API fails
        try {
            const reply = getChatReply(req.body.message);
            res.json({ reply });
        } catch (fallbackError) {
            console.error("Fallback response error:", fallbackError);
            res.status(500).json({ error: "Error generating response" });
        }
    }
});

app.listen(3000, () => console.log("✅ Server running on port 3000"));