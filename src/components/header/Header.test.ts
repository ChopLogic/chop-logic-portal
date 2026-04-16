import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { beforeAll, describe, expect, it } from "vitest";
import Header from "./Header.astro";

describe("Header.astro", () => {
	let container: Awaited<ReturnType<typeof AstroContainer.create>>;

	beforeAll(async () => {
		container = await AstroContainer.create();
	});

	it("renders a header with navigation and the main site links", async () => {
		const html = await container.renderToString(Header, {
			request: new Request("https://example.com/"),
		});
		expect(html).toContain("<header");
		expect(html).toContain("<nav");
		expect(html).toContain('class="internal-links"');
		expect(html).toContain('href="/"');
		expect(html).toContain("Home");
		expect(html).toContain('href="/blog"');
		expect(html).toContain("Blog");
		expect(html).toContain('href="/about"');
		expect(html).toContain("About");
	});

	it("marks the Blog link active on nested blog routes", async () => {
		const html = await container.renderToString(Header, {
			request: new Request("https://example.com/blog/article-slug"),
		});
		const blogTag = html.match(/<a\s[^>]*href="\/blog"[^>]*>/i)?.[0];
		expect(blogTag).toBeDefined();
		expect(blogTag).toContain("active");
	});

	it("marks the About link active on /about", async () => {
		const html = await container.renderToString(Header, {
			request: new Request("https://example.com/about"),
		});
		const aboutTag = html.match(/<a\s[^>]*href="\/about"[^>]*>/i)?.[0];
		expect(aboutTag).toBeDefined();
		expect(aboutTag).toContain("active");
	});
});
