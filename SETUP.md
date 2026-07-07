# Pathwise Setup

This ZIP contains the current latest project code split into two folders:

```txt
pathwise-app/
├── frontend/   # Current TanStack Start app source
├── backend/    # Current server/API/database-related source
└── SETUP.md
```

## Requirements

- Node.js 20+
- Bun 1.1+

## Run the app locally

```bash
cd frontend
bun install
bun dev
```

Open the local URL printed by the dev server, usually:

```txt
http://localhost:8080
```

## Environment variables

Create a local `.env` file inside `frontend/` if your environment requires backend/auth values.
Do not commit `.env` files.

Common public variables for this app are:

```bash
VITE_SUPABASE_URL=your_backend_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
VITE_SUPABASE_PROJECT_ID=your_project_id
```

## Backend folder

The `backend/` folder contains the current server-side pieces extracted from the project:

- API route handlers under `backend/src/routes/api/`
- Server functions and backend helpers under `backend/src/lib/`
- Server startup files under `backend/src/`
- Database/backend configuration files under `backend/supabase/` when present

The main runnable development app is the `frontend/` folder because this project uses TanStack Start, which keeps frontend and server code in one full-stack app.

## Build

```bash
cd frontend
bun install
bun run build
```

## Notes

- `node_modules/`, build outputs, cache folders, git metadata, and `.env` files are intentionally excluded.
- The archive contains only the current project files.
