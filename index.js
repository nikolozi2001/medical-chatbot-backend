const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const OpenAI = require("openai");

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post("/chat", async (req, res) => {
    try {
        const { message } = req.body;
        
        // AI system prompt for medical chatbot
        const systemPrompt = "You are a medical chatbot. Answer queries about medical consultations, fees, and clinic schedules.";

        const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: message }
            ],
        });

        res.json({ reply: response.choices[0].message.content });
    } catch (error) {
        res.status(500).json({ error: "Error generating response" });
    }
});

app.listen(3000, () => console.log("Server running on port 3000"));
