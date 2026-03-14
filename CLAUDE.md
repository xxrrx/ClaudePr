# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run setup        # Initial setup: install deps + run Prisma migrations
npm run dev          # Dev server with Turbopack at http://localhost:3000
npm run build        # Production build
npm run lint         # ESLint
npm run test         # Vitest (JSDOM environment)
npm run db:reset     # Force reset SQLite database
```

To run a single test file: `npx vitest run src/path/to/file.test.ts`

## Environment

Copy `.env.example` to `.env` and add `ANTHROPIC_API_KEY`. Without it, the app falls back to a `MockLanguageModel` that returns static demo components.

## Architecture

UIGen is an AI-powered React component generator. Users describe components in a chat, Claude generates code via tool calls, and components render live in an sandboxed iframe — all without touching the disk.

### Three-Panel Layout

`src/app/main-content.tsx` renders the root layout:
- **Left**: `ChatInterface` — message list + input, powered by `@ai-sdk/react` `useChat` hook
- **Right top**: `PreviewFrame` — live iframe preview
- **Right bottom**: `FileTree` + Monaco `Editor`

### Code Generation Pipeline

1. User prompt → `POST /api/chat` (`src/app/api/chat/route.ts`)
2. Route calls Claude with tool definitions from `src/lib/tools/`
3. Tools (`str_replace_editor`, `file_manager`) mutate the **virtual file system** (in-memory, no disk I/O) via `FileSystemContext`
4. `PreviewFrame` reacts to file system changes, compiles JSX with Babel standalone, and injects into a sandboxed iframe using an import map for module resolution

### Key Contexts

- `FileSystemContext` (`src/lib/contexts/`) — in-memory virtual FS; serialized to DB as JSON on save
- `ChatContext` — messages state, wraps `useChat`

### AI Provider (`src/lib/provider.ts`)

Uses `@anthropic-ai/sdk` with **Claude Haiku 4.5**. Falls back to `MockLanguageModel` if no API key is set. The mock returns hardcoded Counter/Form/Card components.

### Auth & Persistence

- JWT sessions stored in `auth-token` cookie (7-day expiry), bcrypt password hashing
- Prisma + SQLite (`prisma/dev.db`) with two models: `User` and `Project`
- `Project` stores `messages` (JSON string) and `data` (serialized virtual FS)
- Anonymous users can generate freely; only authenticated users can save/load projects
- Server actions in `src/actions/`

### Path Alias

`@/*` maps to `src/*` throughout the project.

## Code Style

Use comments sparingly. Only comment complex code.
