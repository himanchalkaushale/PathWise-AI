# PathWise AI - Frontend

PathWise AI is an intelligent learning roadmap generator that helps users achieve their educational goals. By simply entering a learning objective, the AI automatically generates a comprehensive, structured roadmap complete with modules, interactive lessons, and quizzes to track your progress.

This repository contains the **Frontend** application, built with modern web technologies to deliver a fast, responsive, and beautiful user experience.

---

## 📸 Screenshots

| Landing Page | Chat App |
| ------------ | -------- |
| ![Landing Page](landing-page.png) | ![Chat App](chat-app.png) |

---

## ✨ Features

- **AI-Powered Roadmaps:** Instantly generate personalized learning paths based on your specific goals.
- **Structured Learning Modules:** Roadmaps are broken down into digestible modules and individual lessons.
- **Full-Screen Reading Mode:** Immerse yourself in the generated lesson content with a distraction-free full-screen UI.
- **Interactive Quizzes:** Test your knowledge with dynamically generated quizzes at the end of each module.
- **Collapsible UI:** Easily navigate through long modules and quizzes using collapsible UI elements.
- **Progress Tracking:** Keep track of your completed lessons and quiz scores.
- **Beautiful & Modern UI:** Built with Shadcn UI and Tailwind CSS for a premium, accessible, and responsive design.
- **Client-Side Routing:** Lightning-fast navigation using TanStack Router.

## 🛠 Tech Stack

The frontend is a pure JavaScript (`.js` / `.jsx`) application utilizing:

- **Framework:** [React 19](https://react.dev/)
- **Build Tool / Dev Server:** [Vite](https://vitejs.dev/) + [Nitro](https://nitro.unjs.io/) (via TanStack Start engine)
- **Routing:** [TanStack Router](https://tanstack.com/router/latest)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components:** [Shadcn UI](https://ui.shadcn.com/) (Radix UI + Framer Motion)
- **Data Fetching:** [TanStack Query](https://tanstack.com/query/latest)
- **Markdown Rendering:** `react-markdown` with `katex` (for math) and `highlight.js` (for code formatting)

## 📦 Project Structure

```text
/frontend
├── public/                 # Static assets
├── src/
│   ├── assets/             # Images and local assets
│   ├── components/         # Reusable UI components (Shadcn UI, Nav, etc.)
│   ├── lib/                # API functions and utility helpers
│   ├── models/             # Mongoose schemas (shared structure reference)
│   ├── routes/             # TanStack Router file-based routing
│   │   ├── _authenticated/ # Protected routes (Dashboard, Roadmaps, Profile)
│   │   └── index.jsx       # Landing page
│   ├── styles.css          # Global Tailwind styles
│   ├── server.js           # TanStack Start server entry point
│   ├── start.js            # TanStack Start client entry point
│   └── router.jsx          # Router configuration
├── .env                    # Environment variables
├── vite.config.js          # Custom Vite + Nitro configuration
└── components.json         # Shadcn UI configuration
```

## 🚀 Installation & Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- A running backend server (see the `backend` folder for instructions)

### 1. Clone & Install Dependencies

Open your terminal and navigate to the frontend directory:

```bash
cd frontend
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root of the `frontend` folder (or copy from `.env.example` if available). Update the variables as needed:

```env
# The port the frontend dev server will run on
PORT=5173

# The URL pointing to your running backend API
VITE_API_URL=http://localhost:4000
```

### 3. Start the Development Server

```bash
npm run dev
```

The application will now be running at `http://localhost:5173`. Open this URL in your browser to start exploring!

---

## 🎨 Adding New UI Components

This project uses [Shadcn UI](https://ui.shadcn.com/). To add new components, use the standard shadcn CLI command from the `frontend` directory. 

*Note: The project is configured to use pure JavaScript/JSX, so new components will automatically be installed as `.jsx` files.*

```bash
npx shadcn@latest add [component-name]
```
