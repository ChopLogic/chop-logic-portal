// @ts-check

import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
	site: "https://example.com",
	integrations: [mdx(), sitemap(), react()],
	image: {
		remotePatterns: [
			{
				protocol: "http",
				hostname: "localhost",
				port: "1337",
				pathname: "/uploads/**",
			},
			{
				protocol: "https",
				hostname: "localhost",
				port: "1337",
				pathname: "/uploads/**",
			},
		],
	},
	vite: {
		// chop-logic-components imports .css from JS; when externalized for SSR /
		// prerender, Node loads raw ESM and fails on `.css`. Per Astro/Vite 7,
		// use `resolve.noExternal` so the package is bundled through Vite (not only
		// legacy `ssr.noExternal`).
		resolve: {
			noExternal: ["chop-logic-components"],
		},
	},
});
