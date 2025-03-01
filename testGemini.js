const dotenv = require("dotenv");
const { GoogleGenerativeAI } = require("@google/generative-ai");

dotenv.config();

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not set in the environment variables.");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

async function testGemini(prompt) {
  try {
    const result = await model.generateContent({ contents: [{ role: "user", parts: [{ text: prompt }] }] });
    return result.response.text();
  } catch (error) {
    console.error("🚨 Gemini API Error:", error.message || error);
    return `You asked: ${prompt}. This is a placeholder response.`;
  }
}

module.exports = testGemini;
