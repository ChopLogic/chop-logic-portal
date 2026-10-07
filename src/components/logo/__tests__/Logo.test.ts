import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { beforeAll, describe, expect, it } from "vitest";
import Logo from "../Logo.astro";

describe("Logo.astro", () => {
	let html: string;

	beforeAll(async () => {
		const container = await AstroContainer.create();
		html = await container.renderToString(Logo);
	});

	it("renders two links to the home page", () => {
		expect(html.match(/<a\s[^>]*href="\/"/g)).toHaveLength(2);
	});

	it("renders horizontal and small logo variants", () => {
		expect(html).toContain("logo--horizontal");
		expect(html).toContain("logo--small");
	});

	it("renders an inline svg in each link", () => {
		expect(html.match(/<svg[\s>]/g)).toHaveLength(2);
	});

	it("replaces hardcoded fills with currentColor", () => {
		expect(html).toContain('fill="currentColor"');
		expect(html).not.toMatch(/fill="#[0-9a-fA-F]{3,6}"/);
	});
});
