# Simple Blog (BOOTCAMP1ST)

A React job board with Auth0 authentication and an author Q&A chatbot.

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Environment variables

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

Required for the chatbot backend:

- `OPENAI_API_KEY` — OpenAI API key (server-side only, never exposed to the browser)
- `OPENAI_MODEL` — optional, defaults to `gpt-4o-mini`
- `PORT` — optional, defaults to `3001`

Existing Auth0 variables:

- `REACT_APP_AUTH0_DOMAIN`
- `REACT_APP_AUTH0_CLIENT_ID`

### Run locally

Start both the chat API server and the React app:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

You can also run them separately:

```bash
npm run start:server   # Chat API on http://localhost:3001
npm start              # React app on http://localhost:3000
```

### Author chatbot configuration

Author knowledge for the chatbot lives in `server/authorPrompt.js`. Update that file to change what the chatbot knows about the author. The prompt is sent to the LLM as system instructions on every request — no per-question answer mapping in UI code.

## Available Scripts

### `npm run dev`

Runs the chat API server and React app concurrently.

### `npm start`

Runs the React app in development mode.

### `npm run start:server`

Runs the chat API proxy server.

### `npm test`

Launches the test runner.

### `npm run lint`

Runs ESLint on `src/`.

### `npm run build`

Builds the app for production to the `build` folder.

## Chatbot Architecture

- **Frontend:** `src/components/Chatbot/Chatbot.js` — floating chat widget using Chakra UI
- **API client:** `src/services/chatApi.js` — calls `/api/chat` (no API keys in the browser)
- **Backend:** `server/index.js` — Express proxy that calls OpenAI with the author system prompt
- **Author prompt:** `server/authorPrompt.js` — single configurable source of author knowledge
