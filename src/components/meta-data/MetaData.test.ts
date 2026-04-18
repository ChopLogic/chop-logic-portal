import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { beforeAll, describe, expect, it } from "vitest";
import type { MetaData as PageMetaData } from "../../lib/content/models";
import { OgType } from "../../lib/content/models";
import MetaData from "./MetaData.astro";

function basePageMeta(overrides: Partial<PageMetaData> = {}): PageMetaData {
	const base: PageMetaData = {
		metaTitle: "Page title",
		metaDescription: "Page description",
		robots: "index, follow",
		openGraph: {
			ogTitle: "OG title",
			ogDescription: "OG description",
			ogType: OgType.WEBSITE,
			ogImage: {
				src: "/uploads/og.png",
				width: 1200,
				height: 630,
			},
		},
	};

	if (!overrides.openGraph) {
		return { ...base, ...overrides };
	}

	return {
		...base,
		...overrides,
		openGraph: {
			...base.openGraph,
			...overrides.openGraph,
			ogImage:
				overrides.openGraph.ogImage !== undefined
					? overrides.openGraph.ogImage
					: base.openGraph.ogImage,
		},
	};
}

describe("MetaData.astro", () => {
	let container: Awaited<ReturnType<typeof AstroContainer.create>>;

	beforeAll(async () => {
		container = await AstroContainer.create();
	});

	async function render(
		metaData: PageMetaData,
		options: { siteTitle?: string; requestUrl?: string } = {},
	) {
		const siteTitle = options.siteTitle ?? "Chop Logic";
		const requestUrl =
			options.requestUrl ?? "https://example.com/articles/sample/";
		return container.renderToString(MetaData, {
			props: { siteTitle, metaData },
			request: new Request(requestUrl),
		});
	}

	it("emits charset, viewport, icons, sitemap, RSS, and font preloads", async () => {
		const html = await render(basePageMeta());
		expect(html).toContain('<meta charset="utf-8">');
		expect(html).toContain("width=device-width");
		expect(html).toContain('href="/favicon.svg"');
		expect(html).toContain('href="/favicon.ico"');
		expect(html).toContain('href="/sitemap-index.xml"');
		expect(html).toContain('type="application/rss+xml"');
		expect(html).toContain("https://example.com/rss.xml");
		expect(html).toContain('href="/fonts/Chopin-Bold.woff2"');
		expect(html).toContain('href="/fonts/Chopin-Regular.woff2"');
		expect(html).toContain('href="/fonts/FliegeMono-Regular.woff2"');
	});

	it("sets canonical from the request URL when canonicalURL is omitted", async () => {
		const html = await render(basePageMeta(), {
			requestUrl: "https://example.com/docs/guide/",
		});
		expect(html).toContain(
			'<link rel="canonical" href="https://example.com/docs/guide/">',
		);
	});

	it("uses canonicalURL from meta when provided", async () => {
		const html = await render(
			basePageMeta({
				canonicalURL: "https://example.com/preferred/",
			}),
			{ requestUrl: "https://example.com/other/path/" },
		);
		expect(html).toContain(
			'<link rel="canonical" href="https://example.com/preferred/">',
		);
	});

	it("renders primary title, description, and robots", async () => {
		const html = await render(
			basePageMeta({
				metaTitle: "Custom title",
				metaDescription: "Custom desc",
				robots: "noindex",
			}),
		);
		expect(html).toContain("<title>Custom title</title>");
		expect(html).toContain('name="title"');
		expect(html).toContain('content="Custom title"');
		expect(html).toContain('name="description"');
		expect(html).toContain('content="Custom desc"');
		expect(html).toContain('name="robots"');
		expect(html).toContain('content="noindex"');
	});

	it("renders keywords and author only when set", async () => {
		const without = await render(basePageMeta());
		expect(without).not.toContain('name="keywords"');
		expect(without).not.toContain('name="author"');

		const withOptional = await render(
			basePageMeta({
				keywords: "a, b",
				authorName: "Ada",
			}),
		);
		expect(withOptional).toContain('name="keywords"');
		expect(withOptional).toContain('content="a, b"');
		expect(withOptional).toContain('name="author"');
		expect(withOptional).toContain('content="Ada"');
	});

	it("renders Open Graph and Twitter tags with resolved og:image URL", async () => {
		const html = await render(
			basePageMeta({
				openGraph: {
					ogTitle: "OG",
					ogDescription: "OGD",
					ogType: OgType.ARTICLE,
					ogImage: { src: "/uploads/card.png", width: 800, height: 420 },
				},
			}),
			{ requestUrl: "https://example.com/news/story/" },
		);
		expect(html).toContain('property="og:type"');
		expect(html).toContain('content="article"');
		expect(html).toContain('property="og:title"');
		expect(html).toContain('content="OG"');
		expect(html).toContain('property="og:description"');
		expect(html).toContain('content="OGD"');
		expect(html).toContain('property="og:image"');
		expect(html).toContain("https://example.com/uploads/card.png");
		expect(html).toContain('property="og:image:width"');
		expect(html).toContain('content="800"');
		expect(html).toContain('property="og:image:height"');
		expect(html).toContain('content="420"');
		expect(html).toContain('name="twitter:card"');
		expect(html).toContain("summary_large_image");
		expect(html).toContain('name="twitter:image"');
		expect(html).toContain("https://example.com/uploads/card.png");
	});

	it("omits og:image width and height when zero or unset", async () => {
		const zero = await render(
			basePageMeta({
				openGraph: {
					ogTitle: "T",
					ogDescription: "D",
					ogType: OgType.WEBSITE,
					ogImage: { src: "/x.png", width: 0, height: 0 },
				},
			}),
		);
		expect(zero).not.toContain('property="og:image:width"');
		expect(zero).not.toContain('property="og:image:height"');

		const unset = await render(
			basePageMeta({
				openGraph: {
					ogTitle: "T",
					ogDescription: "D",
					ogType: OgType.WEBSITE,
					ogImage: { src: "/x.png" },
				},
			}),
		);
		expect(unset).not.toContain('property="og:image:width"');
		expect(unset).not.toContain('property="og:image:height"');
	});

	it("renders OG/Twitter title and description when og fields are empty strings (Astro omits empty content attr value)", async () => {
		const html = await render(
			basePageMeta({
				metaTitle: "Main",
				metaDescription: "Main body",
				openGraph: {
					ogTitle: "",
					ogDescription: "",
					ogType: OgType.WEBSITE,
					ogImage: { src: "/o.png", width: 1, height: 1 },
				},
			}),
		);
		expect(html).toMatch(/property="og:title"\s+content(?:="")?>/);
		expect(html).toMatch(/property="og:description"\s+content(?:="")?>/);
		expect(html).toMatch(/name="twitter:title"\s+content(?:="")?>/);
	});

	it("injects JSON-LD script when structuredData is present", async () => {
		const html = await render(
			basePageMeta({
				structuredData: {
					"@type": "WebPage",
					snippet: "<script",
				},
			}),
		);
		expect(html).toContain('type="application/ld+json"');
		expect(html).toContain("WebPage");
		expect(html).toMatch(/\\u003c/);
	});

	it("omits JSON-LD script when structuredData is absent", async () => {
		const html = await render(basePageMeta());
		expect(html).not.toContain("application/ld+json");
	});
});
