import { OgType } from "@models";
import {
	createAstroContainer,
	createCompleteMetaData,
	createMetaData,
	createMinimalMetaData,
	createOpenGraph,
	createOpenGraphImage,
} from "@test/helpers";
import { beforeAll, describe, expect, it } from "vitest";
import MetaData from "../MetaData.astro";

describe("MetaData.astro", () => {
	let container: Awaited<ReturnType<typeof createAstroContainer>>;

	beforeAll(async () => {
		container = await createAstroContainer();
	});

	async function render(
		metaData: Parameters<typeof MetaData>[0]["metaData"],
		siteTitle = "Test Site",
		siteRoot = "https://example.com",
	) {
		return container.renderToString(MetaData, {
			props: { metaData, siteTitle, siteRoot },
		});
	}

	describe("global metadata", () => {
		it("renders charset meta tag", async () => {
			const html = await render(createMetaData());
			expect(html).toContain('<meta charset="utf-8"');
		});

		it("renders viewport meta tag", async () => {
			const html = await render(createMetaData());
			expect(html).toContain('name="viewport"');
			expect(html).toContain("width=device-width");
		});

		it("renders favicon links", async () => {
			const html = await render(createMetaData());
			expect(html).toContain('rel="icon"');
			expect(html).toContain("/favicon.svg");
			expect(html).toContain("/favicon.ico");
		});

		it("renders sitemap link", async () => {
			const html = await render(createMetaData());
			expect(html).toContain('rel="sitemap"');
			expect(html).toContain("/sitemap-index.xml");
		});

		it("renders RSS feed link with site title", async () => {
			const html = await render(createMetaData(), "My Blog");
			expect(html).toContain('type="application/rss+xml"');
			expect(html).toContain('title="My Blog"');
			expect(html).toContain("rss.xml");
		});
	});

	describe("font preloads", () => {
		it("preloads Chopin-Bold font", async () => {
			const html = await render(createMetaData());
			expect(html).toContain('href="/fonts/Chopin-Bold.woff2"');
			expect(html).toContain('rel="preload"');
			expect(html).toContain('as="font"');
		});

		it("preloads Chopin-Regular font", async () => {
			const html = await render(createMetaData());
			expect(html).toContain('href="/fonts/Chopin-Regular.woff2"');
		});

		it("preloads FliegeMono-Regular font", async () => {
			const html = await render(createMetaData());
			expect(html).toContain('href="/fonts/FliegeMono-Regular.woff2"');
		});
	});

	describe("primary meta tags", () => {
		it("renders canonical URL", async () => {
			const html = await render(createMetaData());
			expect(html).toContain('rel="canonical"');
		});

		it("renders page title", async () => {
			const html = await render(createMetaData({ metaTitle: "My Page Title" }));
			expect(html).toContain("<title>My Page Title</title>");
		});

		it("renders meta title tag", async () => {
			const html = await render(createMetaData({ metaTitle: "SEO Title" }));
			expect(html).toContain('name="title"');
			expect(html).toContain('content="SEO Title"');
		});

		it("renders meta description", async () => {
			const html = await render(
				createMetaData({ metaDescription: "Page description for SEO" }),
			);
			expect(html).toContain('name="description"');
			expect(html).toContain('content="Page description for SEO"');
		});

		it("renders robots meta tag when provided", async () => {
			const html = await render(
				createCompleteMetaData({ robots: "index, follow" }),
			);
			expect(html).toContain('name="robots"');
			expect(html).toContain('content="index, follow"');
		});

		it("renders keywords meta tag when provided", async () => {
			const html = await render(
				createCompleteMetaData({ keywords: "astro, blog, test" }),
			);
			expect(html).toContain('name="keywords"');
			expect(html).toContain('content="astro, blog, test"');
		});

		it("does not render keywords when not provided", async () => {
			const html = await render(createMinimalMetaData());
			const keywordsMatch = html.match(/name="keywords"/);
			expect(keywordsMatch).toBeNull();
		});

		it("renders author meta tag when provided", async () => {
			const html = await render(
				createCompleteMetaData({ authorName: "John Doe" }),
			);
			expect(html).toContain('name="author"');
			expect(html).toContain('content="John Doe"');
		});

		it("does not render author when not provided", async () => {
			const html = await render(createMinimalMetaData());
			const authorMatch = html.match(/name="author"/);
			expect(authorMatch).toBeNull();
		});
	});

	describe("Open Graph tags", () => {
		it("renders og:type", async () => {
			const html = await render(
				createMetaData({
					openGraph: createOpenGraph({ ogType: OgType.WEBSITE }),
				}),
			);
			expect(html).toContain('property="og:type"');
			expect(html).toContain('content="website"');
		});

		it("renders og:type as article for articles", async () => {
			const html = await render(
				createMetaData({
					openGraph: createOpenGraph({ ogType: OgType.ARTICLE }),
				}),
			);
			expect(html).toContain('content="article"');
		});

		it("renders og:url with canonical URL", async () => {
			const html = await render(createMetaData());
			expect(html).toContain('property="og:url"');
		});

		it("renders og:title", async () => {
			const html = await render(
				createMetaData({
					openGraph: createOpenGraph({ ogTitle: "OG Page Title" }),
				}),
			);
			expect(html).toContain('property="og:title"');
			expect(html).toContain('content="OG Page Title"');
		});

		it("uses metaTitle when ogTitle is not set", async () => {
			const html = await render(
				createMetaData({
					metaTitle: "Fallback Title",
					openGraph: createOpenGraph({ ogTitle: "" }),
				}),
			);
			expect(html).toContain('property="og:title"');
		});

		it("renders og:description", async () => {
			const html = await render(
				createMetaData({
					openGraph: createOpenGraph({ ogDescription: "OG Description" }),
				}),
			);
			expect(html).toContain('property="og:description"');
			expect(html).toContain('content="OG Description"');
		});

		it("renders og:image", async () => {
			const html = await render(
				createMetaData({
					openGraph: createOpenGraph({
						ogImage: createOpenGraphImage({ src: "/og-image.jpg" }),
					}),
				}),
			);
			expect(html).toContain('property="og:image"');
		});

		it("renders og:image:width when provided", async () => {
			const html = await render(
				createMetaData({
					openGraph: createOpenGraph({
						ogImage: createOpenGraphImage({ width: 1200 }),
					}),
				}),
			);
			expect(html).toContain('property="og:image:width"');
			expect(html).toContain('content="1200"');
		});

		it("renders og:image:height when provided", async () => {
			const html = await render(
				createMetaData({
					openGraph: createOpenGraph({
						ogImage: createOpenGraphImage({ height: 630 }),
					}),
				}),
			);
			expect(html).toContain('property="og:image:height"');
			expect(html).toContain('content="630"');
		});

		it("does not render og:image:width when width is 0", async () => {
			const html = await render(
				createMetaData({
					openGraph: createOpenGraph({
						ogImage: createOpenGraphImage({ width: 0 }),
					}),
				}),
			);
			expect(html).not.toContain('property="og:image:width"');
		});

		it("does not render og:image:height when height is undefined", async () => {
			const html = await render(createMinimalMetaData());
			expect(html).not.toContain('property="og:image:height"');
		});
	});

	describe("Twitter card tags", () => {
		it("renders twitter:card as summary_large_image", async () => {
			const html = await render(createMetaData());
			expect(html).toContain('name="twitter:card"');
			expect(html).toContain('content="summary_large_image"');
		});

		it("renders twitter:url", async () => {
			const html = await render(createMetaData());
			expect(html).toContain('name="twitter:url"');
		});

		it("renders twitter:title", async () => {
			const html = await render(
				createMetaData({
					openGraph: createOpenGraph({ ogTitle: "Twitter Title" }),
				}),
			);
			expect(html).toContain('name="twitter:title"');
		});

		it("renders twitter:description", async () => {
			const html = await render(createMetaData());
			expect(html).toContain('name="twitter:description"');
		});

		it("renders twitter:image", async () => {
			const html = await render(createMetaData());
			expect(html).toContain('name="twitter:image"');
		});
	});

	describe("structured data", () => {
		it("renders JSON-LD script when structuredData is provided", async () => {
			const html = await render(
				createCompleteMetaData({
					structuredData: {
						"@context": "https://schema.org",
						"@type": "Article",
						headline: "Test Article",
					},
				}),
			);
			expect(html).toContain('type="application/ld+json"');
			expect(html).toContain("schema.org");
		});

		it("does not render JSON-LD when structuredData is not provided", async () => {
			const html = await render(createMinimalMetaData());
			// Check that there's no ld+json script
			const ldJsonMatch = html.match(/application\/ld\+json/);
			expect(ldJsonMatch).toBeNull();
		});
	});

	describe("canonical URL handling", () => {
		it("uses provided canonicalURL when available", async () => {
			const html = await render(
				createMetaData({ canonicalURL: "https://example.com/custom-page" }),
			);
			expect(html).toContain('href="https://example.com/custom-page"');
		});
	});

	describe("edge cases", () => {
		it("handles special characters in metaTitle", async () => {
			const html = await render(
				createMetaData({ metaTitle: "Title with & and special chars" }),
			);
			expect(html).toContain("<title>");
			expect(html).toContain("</title>");
		});

		it("handles unicode in metaDescription", async () => {
			const html = await render(
				createMetaData({
					metaDescription: "Description with émojis 🎉 and 日本語",
				}),
			);
			expect(html).toContain('name="description"');
		});

		it("handles empty optional fields gracefully", async () => {
			const html = await render(createMinimalMetaData());
			expect(html).toContain("<title>");
			expect(html).toContain('name="description"');
		});
	});
});
