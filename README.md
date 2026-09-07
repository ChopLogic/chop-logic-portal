# Chop Logic Portal

Front-end web application for the Chop Logic blog. Built with [Astro.js](https://astro.build),
with [React](https://react.dev) used for isolated interactive islands. Content and page data are
fetched from a headless CMS via GraphQL, mapped into view models, and rendered by Astro components.

## 🧞 npm scripts

All commands are run from the root of the project in a terminal.

| Script | Description |
| :----- | :---------- |
| `npm install` | Install dependencies. |
| `npm run dev` | Regenerate GraphQL types, then start the Astro dev server (default: `localhost:4321`). |
| `npm run build` | Regenerate GraphQL types, then build the production site to `./dist/`. |
| `npm run preview` | Serve the production build locally. |
| `npm run astro` | Run the Astro CLI (e.g. `npm run astro -- add`, `npm run astro -- check`). |
| `npm run prepare` | Husky install hook (runs after `npm install`). |
| `npm run typegen` | Generate typed GraphQL query/result types via GraphQL Codegen. |
| `npm run lint` | Run Biome lint + format check on the repo. |
| `npm run lint:fix` | Run Biome and apply safe fixes (lint + format + organize imports). |
| `npm run format` | Format files with Biome. |
| `npm run typecheck` | Type-check the project with `tsc --noEmit`. |
| `npm run astro:check` | Run Astro’s checker (`astro check`) for `.astro` and TS diagnostics. |
| `npm run check` | Run lint, typecheck, Astro check, and tests (CI-style). |
| `npm run test` | Run Vitest in watch mode (when interactive). |
| `npm run test:ci` | Run Vitest once, non-interactive; succeeds even with no tests. |
| `npm run test:coverage` | Run Vitest with V8 coverage; reports go to `./coverage/`. |
