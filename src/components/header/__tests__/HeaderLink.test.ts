import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { beforeAll, describe, expect, it } from "vitest";
import HeaderLink from "../HeaderLink.astro";

describe("HeaderLink.astro", () => {
	let container: Awaited<ReturnType<typeof AstroContainer.create>>;

	beforeAll(async () => {
		container = await AstroContainer.create();
	});

	function linkOpeningTag(html: string, href: string): string | undefined {
		const escaped = href.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
		const re = new RegExp(`<a\\s[^>]*href="${escaped}"[^>]*>`, "i");
		const m = html.match(re);
		return m?.[0];
	}

	it("marks href as active when it matches the request path exactly", async () => {
		const html = await container.renderToString(HeaderLink, {
			props: { href: "/about" },
			slots: { default: "About" },
			request: new Request("https://example.com/about"),
		});
		expect(linkOpeningTag(html, "/about")).toContain("active");
	});

	it("marks href as active for first path segment on nested routes", async () => {
		const html = await container.renderToString(HeaderLink, {
			props: { href: "/blog" },
			slots: { default: "Blog" },
			request: new Request("https://example.com/blog/some-post"),
		});
		expect(linkOpeningTag(html, "/blog")).toContain("active");
	});

	it("marks home link active on site root", async () => {
		const html = await container.renderToString(HeaderLink, {
			props: { href: "/" },
			slots: { default: "Home" },
			request: new Request("https://example.com/"),
		});
		expect(linkOpeningTag(html, "/")).toContain("active");
	});

	it("does not mark other links active on unrelated paths", async () => {
		const html = await container.renderToString(HeaderLink, {
			props: { href: "/blog" },
			slots: { default: "Blog" },
			request: new Request("https://example.com/about"),
		});
		expect(linkOpeningTag(html, "/blog")).not.toContain("active");
	});

	it("merges optional class with active state", async () => {
		const html = await container.renderToString(HeaderLink, {
			props: { href: "/blog", class: "nav-link" },
			slots: { default: "Blog" },
			request: new Request("https://example.com/blog"),
		});
		const tag = linkOpeningTag(html, "/blog");
		expect(tag).toContain("nav-link");
		expect(tag).toContain("active");
	});
});
