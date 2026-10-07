# Copilot Instructions — Chop Logic Portal

## Project overview

Chop Logic Portal is the front-end web application for the Chop Logic blog. It is built with
[Astro.js](https://astro.build) (server-rendered/static pages, `.astro` components) with
[React](https://react.dev) used for isolated interactive islands (e.g. `ScrollToTopButton.tsx`).
Content and page data are fetched from a headless CMS via GraphQL (see `src/api/`), then mapped
into view models (`src/mappers/`, `src/models/`) and rendered by Astro components (`src/components/`,
`src/layouts/`, `src/pages/`).

Key directories:
- `src/pages/` — Astro file-based routes (home, blog, about, privacy policy).
- `src/components/` — Reusable Astro (and a few React) UI components, organized by feature/component name.
- `src/layouts/` — Shared page layout(s).
- `src/api/` — GraphQL client, queries, and generated types (`src/api/types/generated.ts` via GraphQL Codegen).
- `src/mappers/` — Transform raw API responses into domain models.
- `src/models/` — TypeScript types/interfaces for domain data.
- `src/services/` — App configuration and page-fetching services.
- `src/constants/`, `src/styles/` — Shared constants and global CSS.

Tooling: Biome for lint/format, TypeScript (`tsc --noEmit`), `astro check` for Astro/TS diagnostics,
Vitest for unit tests, GraphQL Codegen for typed API queries, Husky + lint-staged + commitlint for git hooks.

## npm scripts

Run all commands from the repo root.

| Script | Description |
| :----- | :---------- |
| `npm run dev` | Regenerate GraphQL types, then start the Astro dev server (`localhost:4321`). |
| `npm run build` | Regenerate GraphQL types, then build the production site to `./dist/`. |
| `npm run preview` | Serve the production build locally. |
| `npm run astro` | Run the Astro CLI directly (e.g. `npm run astro -- add`). |
| `npm run typegen` | Generate typed GraphQL query/result types via GraphQL Codegen. |
| `npm run lint` | Run Biome lint + format check. |
| `npm run lint:fix` | Run Biome and apply safe fixes (lint + format + organize imports). |
| `npm run format` | Format files with Biome. |
| `npm run typecheck` | Type-check the project with `tsc --noEmit`. |
| `npm run astro:check` | Run Astro's checker for `.astro` files and TS diagnostics. |
| `npm run check` | Run lint, typecheck, Astro check, and CI tests — use this before considering a change complete. |
| `npm run test` | Run Vitest in watch mode. |
| `npm run test:ci` | Run Vitest once, non-interactive (used in CI). |
| `npm run test:coverage` | Run Vitest with V8 coverage report (`./coverage/`). |

## Conventions

- Prefer `.astro` components for static/server-rendered UI; only use React (`.tsx`) for components
  needing client-side interactivity, and hydrate them explicitly (e.g. `client:load`).
- Co-locate tests under a component's `__tests__/` folder.
- After editing GraphQL queries in `src/api/queries/`, run `npm run typegen` to refresh
  `src/api/types/generated.ts`.
- Run `npm run check` (or at least `lint` + `typecheck`) before finishing a task.
