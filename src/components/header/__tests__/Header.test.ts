import {
	createAstroContainerWithReact,
	createTestRequest,
} from "@test/helpers";
import { beforeAll, describe, expect, it } from "vitest";
import Header from "../Header.astro";

describe("Header.astro", () => {
	let container: Awaited<ReturnType<typeof createAstroContainerWithReact>>;

	beforeAll(async () => {
		container = await createAstroContainerWithReact();
	});

	async function render(requestPath = "/") {
		return container.renderToString(Header, {
			request: createTestRequest(requestPath),
		});
	}

	it("renders a header element", async () => {
		const html = await render();
		expect(html).toContain("<header");
		expect(html).toContain("</header>");
	});

	it("applies header class to the header element", async () => {
		const html = await render();
		expect(html).toContain('class="header"');
	});

	it("contains a header container div", async () => {
		const html = await render();
		expect(html).toContain('class="header__container"');
	});

	it("renders the Logo component", async () => {
		const html = await render();
		// Logo renders links to home page
		expect(html).toContain('href="/"');
		// Logo contains SVG elements
		expect(html).toContain("<svg");
	});

	it("renders navigation with Blog link", async () => {
		const html = await render();
		expect(html).toContain('href="/blog"');
		expect(html).toContain("Blog");
	});

	it("renders navigation with About link", async () => {
		const html = await render();
		expect(html).toContain('href="/about"');
		expect(html).toContain("About");
	});

	it("applies header__navigation class to nav element", async () => {
		const html = await render();
		expect(html).toContain('class="header__navigation"');
	});

	it("applies header__link class to navigation links", async () => {
		const html = await render();
		expect(html).toContain("header__link");
	});

	it("contains the header toolbar", async () => {
		const html = await render();
		expect(html).toContain('class="header__toolbar"');
	});

	it("renders the Menu component", async () => {
		const html = await render();
		// Menu renders a button to open the dialog
		expect(html).toContain("menu__button");
	});

	it("marks Blog link as active on /blog path", async () => {
		const html = await render("/blog");
		// The active class should be applied to the Blog link
		const blogLinkMatch = html.match(/<a[^>]*href="\/blog"[^>]*>/);
		expect(blogLinkMatch?.[0]).toContain("active");
	});

	it("marks About link as active on /about path", async () => {
		const html = await render("/about");
		// The active class should be applied to the About link
		const aboutLinkMatch = html.match(/<a[^>]*href="\/about"[^>]*>/);
		expect(aboutLinkMatch?.[0]).toContain("active");
	});

	it("does not mark Blog link as active on /about path", async () => {
		const html = await render("/about");
		const blogLinkMatch = html.match(/<a[^>]*href="\/blog"[^>]*>/);
		expect(blogLinkMatch?.[0]).not.toContain("active");
	});

	it("marks Blog link as active on nested blog routes", async () => {
		const html = await render("/blog/some-article");
		const blogLinkMatch = html.match(/<a[^>]*href="\/blog"[^>]*>/);
		expect(blogLinkMatch?.[0]).toContain("active");
	});
});
