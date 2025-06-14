# CLAUDE.md - Repository Guidelines

## Build Commands
- Root: `bun run format` (Biome format), `bun run check` (Biome lint)
- API: `cd packages/api && bun run dev` (Bun hot reload)
- Frontend: `cd packages/frontend && bun run dev` (Vite)
- Build: `cd packages/frontend && bun run build && bun run serve`
- Typecheck: `cd packages/frontend && bun run typecheck`

## Code Style
- TypeScript: Strict typing enabled, use explicit types
- Imports: ES Modules, path aliases (`@/*` in frontend)
- Naming: camelCase for variables/functions, PascalCase for components/types
- Components: Organize by feature, UI components in `components/ui/`
- Formatting: Biome is used for formatting and linting
- Errors: Avoid non-null assertions when possible
- Architecture: monorepo with tRPC (API) + React (frontend) with Tailwind

## Stack
- Frontend: React, TanStack Router, Tailwind CSS, shadcn/ui
- API: tRPC, Hono, Drizzle ORM
- Build Tools: Vite, Bun, Biome