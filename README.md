# TrumpGPT-Wrapper

A Node.js-based ChatGPT wrapper that provides a web-based chat interface to interact with OpenAI’s API, featuring a Trump-like AI assistant with a playful, engaging tone. Built with Express for the backend, a custom HTML/CSS frontend, and `dotenv` for secure configuration, this application allows users to send messages and receive responses styled like Donald Trump.

## Features

- **Interactive Chat**: Web interface for real-time conversations with an AI assistant.
- **Trump-like Responses**: Powered by OpenAI’s API with a custom system prompt to mimic Trump’s short, real, and playful tone.
- **Conversation History**: In-memory storage of chats (resets on server restart).
- **Custom Styling**: Responsive UI, defined in `public/style.css`.
- **Secure Setup**: API keys managed via `.env` with `dotenv`, excluded from Git using `.gitignore`.
- **Clear Chat Option**: Button to reset the conversation history.

## Tech Stack

- **Node.js**: Server runtime (v22.15.1 recommended, per project logs).
- **Express**: Handles API routes (`/api/chat`, `/api/clear`, `/api/conversation`) for chat functionality.
- **OpenAI API**: Uses the `gpt-3.5-turbo` model (configurable to `gpt-4` if available) with a custom system prompt:
