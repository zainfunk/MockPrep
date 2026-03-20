# MockPrep

AI-powered mock technical interview app. Practice coding interviews with an AI interviewer powered by Claude.

## Features

- **3 problems** to start: Two Sum (Easy), Longest Substring Without Repeating Characters (Medium), Merge K Sorted Lists (Hard)
- **AI Interviewer** — Powered by Claude (claude-sonnet-4-6). Uses the Socratic method, gives hints without spoiling answers, and responds in real time via streaming
- **Monaco Code Editor** — The same editor used in VS Code, with TypeScript support
- **45-minute countdown timer** — Ends the session automatically when time runs out
- **Detailed feedback** — Get scored on Communication, Problem Solving, and Code Quality after each session

## Getting Started

### Prerequisites

- Node.js 18+
- An Anthropic API key ([get one here](https://console.anthropic.com))

### Setup

1. Clone the repo and install dependencies:
   ```bash
   git clone https://github.com/Funk0/MockPrep
   cd MockPrep
   npm install
   ```

2. Create a `.env.local` file:
   ```bash
   cp .env.local.example .env.local
   ```
   Add your Anthropic API key to `.env.local`.

3. Start the dev server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000)

## Tech Stack

- [Next.js 14](https://nextjs.org/) (App Router)
- [Tailwind CSS](https://tailwindcss.com/)
- [Monaco Editor](https://github.com/microsoft/monaco-editor) via `@monaco-editor/react`
- [Anthropic SDK](https://github.com/anthropics/anthropic-sdk-typescript) (`@anthropic-ai/sdk`)
