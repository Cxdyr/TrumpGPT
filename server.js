const express = require('express');
const cors = require('cors');
const path = require('path');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize OpenAI client with API key and optional project ID
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  ...(process.env.OPENAI_PROJECT_ID && { project: process.env.OPENAI_PROJECT_ID }),
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Store conversation history in memory (use a database in production)
let conversations = {};

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, conversationId = 'default' } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: 'OpenAI API key not configured' });
    }

    // Initialize conversation with system prompt if it doesn’t exist
    if (!conversations[conversationId]) {
      conversations[conversationId] = [
        {
          role: 'system',
          content: 'Respond with short and real tone, while being playful and encouraging more responses! Speak like Donald Trump would.',
        },
      ];
    }

    // Add user message to conversation
    conversations[conversationId].push({ role: 'user', content: message });

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // Use 'gpt-4' if you have access
      messages: conversations[conversationId],
      max_tokens: 2048,
      temperature: 1,
      top_p: 1,
    });

    const assistantMessage = response.choices[0].message.content;

    // Add assistant response to conversation
    conversations[conversationId].push({ role: 'assistant', content: assistantMessage });

    res.json({
      message: assistantMessage,
      conversationId,
    });
  } catch (error) {
    console.error('Chat error:', {
      message: error.message,
      status: error.status,
      code: error.code,
      type: error.type,
    });
    res.status(error.status || 500).json({ error: error.message || 'Internal server error' });
  }
});

// Clear conversation endpoint
app.post('/api/clear', (req, res) => {
  try {
    const { conversationId = 'default' } = req.body;
    conversations[conversationId] = [
      {
        role: 'system',
        content: 'Respond with short and real tone, while being playful and encouraging more responses! Speak like Donald Trump would.',
      },
    ];
    res.json({ success: true });
  } catch (error) {
    console.error('Clear error:', error);
    res.status(500).json({ error: 'Failed to clear conversation' });
  }
});

// Get conversation history
app.get('/api/conversation/:id?', (req, res) => {
  const conversationId = req.params.id || 'default';
  if (!conversations[conversationId]) {
    conversations[conversationId] = [
      {
        role: 'system',
        content: 'Respond as if you are Donald J. Trump, be playful and funny but serious if the prompt is in that context.',
      },
    ];
  }
  res.json({
    messages: conversations[conversationId],
    conversationId,
  });
});

// Serve the HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`OpenAI API key ${process.env.OPENAI_API_KEY ? 'loaded' : 'NOT loaded'}`);
  console.log(`OpenAI Project ID ${process.env.OPENAI_PROJECT_ID ? 'loaded' : 'not provided'}`);
  console.log(`Node.js version: ${process.version}`);
});