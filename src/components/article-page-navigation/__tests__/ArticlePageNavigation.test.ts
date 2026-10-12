import { createAstroContainerWithReact } from "@test/helpers";
import { beforeAll, describe, expect, it } from "vitest";
import ArticlePageNavigation from "../ArticlePageNavigation.astro";

describe("ArticlePageNavigation.astro", () => {
	let container: Awaited<ReturnType<typeof createAstroContainerWithReact>>;

	beforeAll(async () => {
		container = await createAstroContainerWithReact();
	});

	async function render(slugs: string[], currentSlug: string) {
		return container.renderToString(ArticlePageNavigation, {
			props: { slugs, currentSlug },
		});
	}

	it("renders a container div with article-page-navigation class", async () => {
		const html = await render(["article-1", "article-2"], "article-1");
		expect(html).toContain('<div class="article-page-navigation"');
		expect(html).toContain("</div>");
	});

	it("renders Previous Article link", async () => {
		const html = await render(["article-1", "article-2"], "article-2");
		expect(html).toContain("Previous Article");
	});

	it("renders Next article link", async () => {
		const html = await render(["article-1", "article-2"], "article-1");
		expect(html).toContain("Next article");
	});

	it("navigates to previous article in middle of list", async () => {
		const slugs = ["first", "second", "third"];
		const html = await render(slugs, "second");
		// Previous should link to "first"
		expect(html).toContain('href="/blog/first"');
	});

	it("navigates to next article in middle of list", async () => {
		const slugs = ["first", "second", "third"];
		const html = await render(slugs, "second");
		// Next should link to "third"
		expect(html).toContain('href="/blog/third"');
	});

	it("wraps from first article to last for previous", async () => {
		const slugs = ["first", "second", "third"];
		const html = await render(slugs, "first");
		// Previous from first should wrap to "third"
		expect(html).toContain('href="/blog/third"');
	});

	it("wraps from last article to first for next", async () => {
		const slugs = ["first", "second", "third"];
		const html = await render(slugs, "third");
		// Next from third should wrap to "first"
		expect(html).toContain('href="/blog/first"');
	});

	it("handles single-item array (previous and next both link to same)", async () => {
		const slugs = ["only-article"];
		const html = await render(slugs, "only-article");
		// Both prev and next should point to the same article
		const matches = html.match(/href="\/blog\/only-article"/g);
		expect(matches).toHaveLength(2);
	});

	it("handles two-item array correctly", async () => {
		const slugs = ["first", "second"];

		// From first article
		const htmlFirst = await render(slugs, "first");
		expect(htmlFirst).toContain('href="/blog/second"'); // prev (wraps) and next both point to second
		const firstMatches = htmlFirst.match(/href="\/blog\/second"/g);
		expect(firstMatches).toHaveLength(2);

		// From second article
		const htmlSecond = await render(slugs, "second");
		expect(htmlSecond).toContain('href="/blog/first"'); // prev and next (wraps) both point to first
		const secondMatches = htmlSecond.match(/href="\/blog\/first"/g);
		expect(secondMatches).toHaveLength(2);
	});

	it("applies article-page-navigation__link class to links", async () => {
		const html = await render(["a", "b"], "a");
		expect(html).toContain("article-page-navigation__link");
	});

	it("handles slugs with special characters", async () => {
		const slugs = ["article-with-123", "another-post-456"];
		const html = await render(slugs, "article-with-123");
		expect(html).toContain('href="/blog/another-post-456"');
	});

	it("handles longer list of articles", async () => {
		const slugs = ["a", "b", "c", "d", "e"];
		const html = await render(slugs, "c");

		// From "c", previous is "b" and next is "d"
		expect(html).toContain('href="/blog/b"');
		expect(html).toContain('href="/blog/d"');
	});

	it("correctly calculates indices at position 0", async () => {
		const slugs = ["article-0", "article-1", "article-2", "article-3"];
		const html = await render(slugs, "article-0");

		// Previous should wrap to last (article-3)
		expect(html).toContain('href="/blog/article-3"');
		// Next should be article-1
		expect(html).toContain('href="/blog/article-1"');
	});

	it("correctly calculates indices at last position", async () => {
		const slugs = ["article-0", "article-1", "article-2", "article-3"];
		const html = await render(slugs, "article-3");

		// Previous should be article-2
		expect(html).toContain('href="/blog/article-2"');
		// Next should wrap to first (article-0)
		expect(html).toContain('href="/blog/article-0"');
	});
});
