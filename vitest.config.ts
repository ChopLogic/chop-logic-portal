/// <reference types="vitest/config" />
import { getViteConfig } from "astro/config";

export default getViteConfig({
	test: {
		include: ["src/**/*.{test,spec}.{ts,tsx}"],
		exclude: ["node_modules", "dist", ".astro"],
		environment: "node",
		coverage: {
			provider: "v8",
			reporter: ["text", "html", "json"],
			reportsDirectory: "./coverage",
			include: ["src/**/*.{ts,tsx}"],
			exclude: [
				"**/*.test.{ts,tsx}",
				"**/*.spec.{ts,tsx}",
				"**/types/**",
				"**/*.d.ts",
			],
		},
	},
});
