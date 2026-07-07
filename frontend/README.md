# Pathwise — AI Learning Roadmap Generator

Full-stack app: enter a learning goal → AI generates a roadmap with modules, lessons, and quizzes → track your progress.

## Structure

```
/frontend   React + Vite + Tailwind + React Router (plain JS)
/backend    Node + Express + Mongoose + JWT (plain JS)
```

Both folders are independent — the frontend talks to the backend over HTTP via `VITE_API_URL`. Swap either side without touching the other.

## Quick start

1. **Backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # fill MONGODB_URI, JWT_SECRET, AI_BASE_URL, AI_API_KEY, AI_MODEL
   npm run dev
   ```

2. **Frontend** (new terminal)
   ```bash
   cd frontend
   npm install
   cp .env.example .env   # VITE_API_URL=http://localhost:4000
   npm run dev
   ```

3. Open http://localhost:5173

## AI endpoint

The backend calls your AI at `${AI_BASE_URL}/chat/completions` with an OpenAI-compatible body. If your endpoint uses a different shape, edit **one file**: `backend/src/utils/ai.js`.

## Features

- JWT auth (register / login)
- AI-generated roadmaps with modules & lessons
- Per-module quizzes
- Progress tracking (lessons + quiz scores)
- Prismic-inspired editorial landing page
- Component-based architecture (every button is a component)

See per-folder READMEs for details.
