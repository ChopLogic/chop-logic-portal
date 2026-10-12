import type { ArticlePreview } from "@models";
import {
	createArticlePreview,
	createArticlePreviews,
	createAstroContainerWithReact,
	resetArticleCounters,
} from "@test/helpers";
import { afterEach, beforeAll, describe, expect, it } from "vitest";
import ArticlesGallery from "../ArticlesGallery.astro";

describe("ArticlesGallery.astro", () => {
	let container: Awaited<ReturnType<typeof createAstroContainerWithReact>>;

	beforeAll(async () => {
		container = await createAstroContainerWithReact();
	});

	afterEach(() => {
		resetArticleCounters();
	});

	async function render(previews: ArticlePreview[]) {
		return container.renderToString(ArticlesGallery, {
			props: { previews },
		});
	}

	it("renders a container div with articles-gallery class", async () => {
		const html = await render(createArticlePreviews(1));
		expect(html).toContain('<div class="articles-gallery"');
		expect(html).toContain("</div>");
	});

	it("renders a PreviewCard for each article preview", async () => {
		const html = await render(createArticlePreviews(3));
		// PreviewCard creates links with the article URL
		expect(html).toContain('href="/blog/');
		// Count the number of article links
		const linkMatches = html.match(/href="\/blog\/article-slug-\d+"/g);
		expect(linkMatches).toHaveLength(3);
	});

	it("generates correct blog links from slugs", async () => {
		const previews = [
			createArticlePreview({ slug: "my-first-article" }),
			createArticlePreview({ slug: "second-post" }),
		];
		const html = await render(previews);
		expect(html).toContain('href="/blog/my-first-article"');
		expect(html).toContain('href="/blog/second-post"');
	});

	it("handles empty previews array", async () => {
		const html = await render([]);
		expect(html).toContain("articles-gallery");
		// Should not contain any PreviewCard links
		expect(html).not.toContain('href="/blog/');
	});

	it("handles single preview", async () => {
		const preview = createArticlePreview({ slug: "only-article" });
		const html = await render([preview]);
		expect(html).toContain('href="/blog/only-article"');
	});

	it("passes article title to PreviewCard", async () => {
		const preview = createArticlePreview({ title: "Amazing Article Title" });
		const html = await render([preview]);
		expect(html).toContain("Amazing Article Title");
	});

	it("passes article image to PreviewCard", async () => {
		const preview = createArticlePreview({
			image: {
				src: "https://cdn.example.com/article-image.jpg",
				alt: "Article featured image",
			},
		});
		const html = await render([preview]);
		expect(html).toContain("https://cdn.example.com/article-image.jpg");
		expect(html).toContain("Article featured image");
	});

	it("applies articles-gallery__summary class to PreviewCard", async () => {
		const html = await render(createArticlePreviews(1));
		expect(html).toContain("articles-gallery__summary");
	});

	it("renders multiple previews in order", async () => {
		const previews = [
			createArticlePreview({ slug: "first-article" }),
			createArticlePreview({ slug: "second-article" }),
			createArticlePreview({ slug: "third-article" }),
		];
		const html = await render(previews);

		const firstIndex = html.indexOf("first-article");
		const secondIndex = html.indexOf("second-article");
		const thirdIndex = html.indexOf("third-article");

		expect(firstIndex).toBeGreaterThanOrEqual(0);
		expect(secondIndex).toBeGreaterThan(firstIndex);
		expect(thirdIndex).toBeGreaterThan(secondIndex);
	});

	it("handles slugs with special characters", async () => {
		const preview = createArticlePreview({
			slug: "article-with-numbers-123",
		});
		const html = await render([preview]);
		expect(html).toContain('href="/blog/article-with-numbers-123"');
	});

	it("handles large number of previews", async () => {
		const previews = createArticlePreviews(10);
		const html = await render(previews);
		const linkMatches = html.match(/href="\/blog\/article-slug-\d+"/g);
		expect(linkMatches).toHaveLength(10);
	});
});
