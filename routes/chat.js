const express = require('express');
const router = express.Router();
const { getChatReply } = require('../services/chatbot');

router.post('/', (req, res) => {
  try {
    const { message } = req.body;
    const reply = getChatReply(message);
    res.json({ reply });
  } catch (error) {
    console.error('Error processing chat message:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
