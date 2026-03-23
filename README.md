# Astro Starter Kit: Blog

```sh
npm create astro@latest -- --template blog
```

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

Features:

- ✅ Minimal styling (make it your own!)
- ✅ 100/100 Lighthouse performance
- ✅ SEO-friendly with canonical URLs and Open Graph data
- ✅ Sitemap support
- ✅ RSS Feed support
- ✅ Markdown & MDX support

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
├── public/
├── src/
│   ├── components/
│   ├── content/
│   ├── layouts/
│   └── pages/
├── astro.config.mjs
├── README.md
├── package.json
└── tsconfig.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

The `src/content/` directory contains "collections" of related Markdown and MDX documents. Use `getCollection()` to retrieve posts from `src/content/blog/`, and type-check your frontmatter using an optional schema. See [Astro's Content Collections docs](https://docs.astro.build/en/guides/content-collections/) to learn more.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 npm scripts

All commands are run from the root of the project in a terminal.

| Script | Description |
| :----- | :---------- |
| `npm install` | Install dependencies. |
| `npm run dev` | Start the Astro dev server (default: `localhost:4321`). |
| `npm run build` | Build the production site to `./dist/`. |
| `npm run preview` | Serve the production build locally. |
| `npm run astro` | Run the Astro CLI (e.g. `npm run astro -- add`, `npm run astro -- check`). |
| `npm run prepare` | Husky install hook (runs after `npm install`). |
| `npm run lint` | Run Biome lint + format check on the repo. |
| `npm run lint:fix` | Run Biome and apply safe fixes (lint + format + organize imports). |
| `npm run format` | Format files with Biome. |
| `npm run typecheck` | Type-check the project with `tsc --noEmit`. |
| `npm run astro:check` | Run Astro’s checker (`astro check`) for `.astro` and TS diagnostics. |
| `npm run check` | Run lint, typecheck, Astro check, and tests (CI-style). |
| `npm run test` | Run Vitest in watch mode (when interactive). |
| `npm run test:ci` | Run Vitest once, non-interactive; succeeds even with no tests. |
| `npm run test:coverage` | Run Vitest with V8 coverage; reports go to `./coverage/`. |

## 👀 Want to learn more?

Check out [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).

## Credit

This theme is based off of the lovely [Bear Blog](https://github.com/HermanMartinus/bearblog/).
