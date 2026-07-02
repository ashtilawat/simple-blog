const express = require('express');
const cors = require('cors');
const path = require('path');
const { AUTHOR_PROMPT } = require('./authorPrompt');

const app = express();
const PORT = process.env.PORT || 3001;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';
const MAX_MESSAGE_LENGTH = 2000;
const REQUEST_TIMEOUT_MS = 30000;

app.use(cors());
app.use(express.json({ limit: '1mb' }));

function validateMessages(messages) {
  if (!Array.isArray(messages) || messages.length === 0) {
    return 'Messages must be a non-empty array.';
  }

  for (const message of messages) {
    if (!message || typeof message !== 'object') {
      return 'Each message must be an object with role and content.';
    }

    if (!['user', 'assistant'].includes(message.role)) {
      return 'Message role must be user or assistant.';
    }

    if (typeof message.content !== 'string' || message.content.trim().length === 0) {
      return 'Message content must be a non-empty string.';
    }

    if (message.content.length > MAX_MESSAGE_LENGTH) {
      return `Each message must be ${MAX_MESSAGE_LENGTH} characters or fewer.`;
    }
  }

  return null;
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.post('/api/chat', async (req, res) => {
  const { messages } = req.body || {};
  const validationError = validateMessages(messages);

  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  if (!AUTHOR_PROMPT || AUTHOR_PROMPT.trim().length === 0) {
    return res.status(500).json({
      error: 'Chatbot configuration is unavailable. Please try again later.'
    });
  }

  if (!OPENAI_API_KEY) {
    return res.status(500).json({
      error: 'Chatbot is temporarily unavailable. Please try again later.'
    });
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages: [{ role: 'system', content: AUTHOR_PROMPT }, ...messages],
        temperature: 0.7
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('OpenAI API error:', response.status, errorBody);
      return res.status(502).json({
        error: 'Unable to get a response right now. Please try again.'
      });
    }

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      return res.status(502).json({
        error: 'Received an empty response. Please try again.'
      });
    }

    return res.json({ reply });
  } catch (error) {
    clearTimeout(timeoutId);

    if (error.name === 'AbortError') {
      return res.status(504).json({
        error: 'The request timed out. Please try again.'
      });
    }

    console.error('Chat API error:', error);
    return res.status(500).json({
      error: 'Something went wrong. Please try again.'
    });
  }
});

if (process.env.NODE_ENV === 'production') {
  const buildPath = path.join(__dirname, '..', 'build');
  app.use(express.static(buildPath));

  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) {
      return next();
    }

    res.sendFile(path.join(buildPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Chat API server listening on port ${PORT}`);
});
