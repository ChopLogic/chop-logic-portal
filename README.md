# Chop Logic Portal

> A Next.js portal for Chop Logic — a small, component-driven site using Biome, Prettier, Vitest, Husky and lint-staged for consistency and quality. 🚀

---

## Table of Contents

- [Quick start](#quick-start)
- [NPM scripts](#npm-scripts)
- [Project structure](#project-structure)
- [Working with the project](#working-with-the-project)
- [Testing & CI](#testing--ci)
- [Linting & Formatting](#linting--formatting)
- [Commit hooks & commit messages](#commit-hooks--commit-messages)
- [Tips & Troubleshooting](#tips--troubleshooting)
- [License](#license)

---

## Quick start ⚡

Prerequisites:

- Node.js (recommended LTS, e.g., 18 or 20)
- npm

Clone and install:

```bash
git clone <repo-url>
cd chop-logic-portal
npm install
```

Run development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
npm run start
```

---

## NPM scripts 📦

Below are the available scripts and what they do.

| Script            | Command                                                      | Description                                    |
| ----------------- | ------------------------------------------------------------ | ---------------------------------------------- |
| `dev`             | `next dev`                                                   | Run Next.js in development mode (hot reload).  |
| `build`           | `next build`                                                 | Create an optimized production build.          |
| `start`           | `next start`                                                 | Start the production server (after `build`).   |
| `format`          | `npm run format:biome && npm run format:prettier`            | Run all formatting steps (Biome + Prettier).   |
| `format:biome`    | `biome format --write`                                       | Format files using Biome.                      |
| `format:prettier` | `prettier --write "**/*.{css,scss,mdx,md}"`                  | Format styles and markdown with Prettier.      |
| `lint`            | `npm run lint:biome && npm run lint:prettier`                | Run all lint checks.                           |
| `lint:biome`      | `biome check`                                                | Run Biome (TS/JS) checks.                      |
| `lint:prettier`   | `prettier --check "**/*.{css,scss,mdx,md}"`                  | Check formatting for styles/markdown.          |
| `lint:errors`     | `biome check --diagnostic-level error --max-diagnostics 100` | Run Biome only showing errors.                 |
| `lint:warnings`   | `biome check --diagnostic-level warn --max-diagnostics 100`  | Run Biome showing warnings.                    |
| `lint:fix`        | `biome check --write`                                        | Auto-fix lint issues where possible.           |
| `typecheck`       | `tsc --pretty --noEmit`                                      | Run TypeScript type checking (no emit).        |
| `test`            | `vitest`                                                     | Run tests (watch mode by default).             |
| `test:ci`         | `vitest run --passWithNoTests`                               | Run tests in CI mode (no watch).               |
| `test:coverage`   | `vitest run --coverage`                                      | Run tests and collect coverage.                |
| `prepare`         | `husky`                                                      | Run Husky install scripts to set up git hooks. |

---

## Project structure 📂

Top-level layout (key folders and files):

- `app/` - Next.js application routes and pages (app router).
  - `page.tsx`, `layout.tsx`, and feature folders like `about/`, `blog/`.
- `public/` - Static assets served by Next.
- `src/` - Source code for UI and app logic.
  - `components/` - Reusable React components (e.g., `header/`, `footer/`).
  - `lib/` - Small libraries and helpers (e.g., `strapi.ts`).
  - `styles/` - Global and component styles (Sass / CSS).
- `vitest.config.mts` - Test configuration.
- `biome.json` - Biome configuration (formatter / linter).
- `commitlint.config.js` - Commit message rules (Conventional Commits).
- `husky/` - Git hooks installed by Husky.

This project follows a component-driven structure: small, focused components with tests living alongside them under `components/*/__tests__/`.

---

## Working with the project 🛠️

Development workflow:

1. Create a feature branch: `git checkout -b feat/your-feature`
2. Implement components under `src/components` or pages under `app/`.
3. Add or update tests in `__tests__` folders and run `npm run test`.
4. Run linters/formatters locally: `npm run format` and `npm run lint`.
5. Commit with a Conventional Commit message (see below).

Testing locally:

- Run tests in watch mode: `npm run test`
- Run a single test or match: `npx vitest -t "pattern"`
- Generate coverage: `npm run test:coverage`

Type checking:

- `npm run typecheck` — ensures all TypeScript types are valid.

---

## Testing & CI ✅

- `vitest` is used for unit tests and runs in watch or CI mode.
- `test:ci` is intended for CI pipelines.
- Snapshot tests live in `__snapshots__` adjacent to test files.

---

## Linting & Formatting ✨

- Biome handles JS/TS formatting and linting.
- Prettier formats CSS/SCSS and Markdown.
- Use `npm run format` and `npm run lint` before committing.

---

## Commit hooks & commit messages 🔒

This repo uses Husky + lint-staged + Commitlint to enforce quality and commit message style:

- Pre-commit: `lint-staged` runs formatters, Biome checks and tests against staged files.
- Commit messages must follow Conventional Commits. The rules are in `commitlint.config.js`.
- If hooks aren't installed, run:

```bash
npm run prepare
```

To validate a commit message locally you can run:

```bash
npx --no-install commitlint --edit -
```

---

## Tips & Troubleshooting 💡

- If Husky hooks aren't active after cloning, run `npm run prepare`.
- If CI fails with lint errors, try `npm run lint:fix` then re-run checks.
- Add environment variables using `.env.local` for local secrets (Next.js standard).

> Note: This repository uses Next.js App Router. Place pages under `app/` and follow route conventions.

---

## License ⚖️

This project is licensed under the terms in the `LICENSE` file.

---
