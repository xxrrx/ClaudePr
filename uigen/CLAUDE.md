# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Development server (Next.js + Turbopack)
npm run build      # Production build
npm run start      # Start production server
npm run lint       # ESLint
npm run test       # Vitest unit tests
npm run setup      # Install deps + generate Prisma client + run migrations
npm run db:reset   # Reset database
```

Run a single test file: `npx vitest run src/path/to/file.test.ts`

## Architecture

**UIGen** is an AI-powered React component generator. Users describe components in chat; Claude generates working React code using tool calls, rendered live in an iframe preview.

### Request Flow

1. User sends message → `POST /api/chat` with `{ messages, files, projectId }`
2. Server streams a response via Vercel AI SDK (`streamText`)
3. Claude calls `str_replace_editor` and/or `file_manager` tools to create/modify files
4. Tool results update the **VirtualFileSystem** (in-memory only, never written to disk)
5. Preview panel re-renders from the virtual FS using Babel JSX transformation in-browser
6. On stream completion, conversation is saved to SQLite via Prisma (authenticated users only)

### Virtual File System

`src/lib/file-system.ts` — `VirtualFileSystem` class manages all generated code in memory. It serializes/deserializes to JSON for persistence in the database and for passing to the API route via the request body.

### AI Tools

- `str_replace_editor` (`src/lib/tools/str-replace.ts`) — create files, view files, string-replace within files, undo edits
- `file_manager` (`src/lib/tools/file-manager.ts`) — rename and delete files

The system prompt in `src/lib/prompts/generation.tsx` guides Claude on how to use these tools to generate React components.

### State Management

- **FileSystemContext** (`src/lib/contexts/file-system-context.tsx`) — React context wrapping VirtualFileSystem; consumed by chat, editor, and preview
- **ChatContext** (`src/lib/contexts/chat-context.tsx`) — wraps Vercel AI SDK's `useChat`; serializes the file system into each chat request

### Layout

`src/app/main-content.tsx` — three-panel resizable layout:
- Left (35%): chat
- Right top (65%): preview/code tabs
- Right bottom code view: file tree (30%) + Monaco editor (70%)

### Auth

JWT sessions via `jose` stored in httpOnly cookies. `src/lib/auth.ts` handles session creation/reading. Server actions in `src/actions/` handle sign-up, sign-in, sign-out, and project CRUD.

Anonymous users can generate components without auth; their work is not persisted.

### Database

SQLite via Prisma. Schema: `User` (id, email, passwordHash) and `Project` (id, userId, name, messages JSON, files JSON). Run `npm run setup` to initialize.

### JSX Transformation

`src/lib/transform/jsx-transformer.ts` uses `@babel/standalone` in the browser to compile JSX to JS and resolve imports for live preview in the iframe (`src/components/preview/PreviewFrame.tsx`).

### AI Provider

`src/lib/provider.ts` — wraps Anthropic API with a `MockLanguageModel` fallback (used when `ANTHROPIC_API_KEY` is absent). The chat route uses `claude-haiku-4-5-20251001` by default; max 40 steps, 10,000 tokens, 120s timeout.

## Environment Variables

`ANTHROPIC_API_KEY` — required for real AI generation; falls back to mock model if absent.
`JWT_SECRET` — required for auth sessions.
