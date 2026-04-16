# Placed

AI-powered mock technical interview app. Practice coding interviews with a live AI interviewer powered by Claude — not just problems in silence, but a real back-and-forth that mimics the experience of an actual technical round.

## Features

### AI Interviewer
- Real-time streaming conversation powered by Claude (claude-sonnet-4-6)
- Socratic method — the AI asks follow-up questions, probes your reasoning, and gives hints without spoiling the answer
- Adapts to your responses throughout the session

### Problem Bank
- **20 curated problems** across 8 categories: Arrays, Strings, Linked Lists, Trees, Dynamic Programming, Graphs, Math, and Backtracking
- **7 Easy · 8 Medium · 5 Hard**
- Filter by difficulty and category on the problem selector screen

### Code Editor
- Monaco editor (same engine as VS Code) embedded in a resizable split-pane layout
- Supports **Python, JavaScript, Java, and C++** with syntax highlighting and autocompletion
- Language selector, Reset Code, and Copy Code toolbar
- Drag to resize the chat panel, problem description, and editor independently

### Timed Sessions
- 45-minute countdown timer with color-coded urgency (green → yellow → red)
- Session ends automatically when time runs out

### Scored Feedback Report
- After every session: detailed scores (1–10) for **Communication**, **Problem Solving**, and **Code Quality**
- Written explanations for each score, top 3 improvement points, and a closing note
- Visual score bars on each category card

### Session History
- Every completed session is automatically saved to localStorage
- `/history` page shows all past sessions sorted by most recent, with expandable cards
- Two-click "Clear History" confirmation

### UI
- Dark mode by default with a light/dark toggle that persists across sessions
- Responsive layout that works on 13" and larger screens

## Getting Started

### Prerequisites

- Node.js 18+
- An Anthropic API key ([get one here](https://console.anthropic.com))

### Setup

1. Clone the repo and install dependencies:
   ```bash
   git clone https://github.com/zainfunk/Placed
   cd Placed
   npm install
   ```

2. Create a `.env.local` file:
   ```bash
   cp .env.local.example .env.local
   ```
   Open `.env.local` and add your Anthropic API key.

3. Start the dev server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000)

> **Tip:** If you see a `Cannot find module './948.js'` error, delete the stale build cache and restart:
> ```bash
> rm -rf .next && npm run dev
> ```

## Routes

| Route | Description |
|---|---|
| `/` | Landing page |
| `/problems` | Problem selector with difficulty and category filters |
| `/interview/[problemId]` | Live interview session |
| `/history` | Past session history |

## Tech Stack

- [Next.js 14](https://nextjs.org/) (App Router)
- [Tailwind CSS](https://tailwindcss.com/)
- [Monaco Editor](https://github.com/microsoft/monaco-editor) via `@monaco-editor/react`
- [Anthropic SDK](https://github.com/anthropics/anthropic-sdk-typescript) (`@anthropic-ai/sdk`)
