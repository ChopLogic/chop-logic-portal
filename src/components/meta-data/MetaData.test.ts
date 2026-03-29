import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, expect, test } from "vitest";
import MetaData from "./MetaData.astro";

const baseProps = {
	siteTitle: "Chop Logic Site Title",
	metaData: {
		metaTitle: "Chop Logic Meta Title",
		metaDescription: "Chop Logic Meta Description",
		robots: "index, follow",
		openGraph: {
			ogDescription: "Chop Logic Open Graph Description",
			ogTitle: "Chop Logic Open Graph Title",
			ogType: "website",
		},
	},
};

async function renderMeta(
	props: Record<string, unknown> = {},
	requestUrl = "https://example.com/docs/page",
) {
	const container = await AstroContainer.create();
	return container.renderToString(MetaData, {
		props: { ...baseProps, ...props },
		request: new Request(requestUrl),
	});
}

describe("MetaData.astro", () => {
	test("renders core SEO and Open Graph tags", async () => {
		const html = await renderMeta();
		expect(html).toContain("<title>Chop Logic Meta Title</title>");
		expect(html).toContain('meta name="title" content="Chop Logic Meta Title"');
		expect(html).toContain(
			'meta name="description" content="Chop Logic Meta Description"',
		);
		expect(html).toContain('meta name="robots" content="index, follow"');
		expect(html).toContain('meta property="og:type" content="website"');
		expect(html).toContain(
			'meta property="og:title" content="Chop Logic Open Graph Title"',
		);
		expect(html).toContain(
			'meta property="og:description" content="Chop Logic Open Graph Description"',
		);
		expect(html).toContain(
			'meta name="twitter:card" content="summary_large_image"',
		);
		expect(html).toContain(
			'meta name="twitter:title" content="Chop Logic Open Graph Title"',
		);
		expect(html).toContain(
			'meta name="twitter:description" content="Chop Logic Open Graph Description"',
		);
		expect(html).toContain('property="og:image"');
		expect(html).toContain('name="twitter:image"');
	});

	test("uses request pathname and site for default canonical, og:url, and twitter:url", async () => {
		const html = await renderMeta(
			{},
			"https://example.com/blog/my-post?ref=twitter",
		);
		expect(html).toContain(
			'<link rel="canonical" href="https://example.com/blog/my-post">',
		);
		expect(html).toContain(
			'<meta property="og:url" content="https://example.com/blog/my-post">',
		);
		expect(html).toContain(
			'<meta name="twitter:url" content="https://example.com/blog/my-post">',
		);
	});

	test("uses custom canonicalURL for canonical, og:url, and twitter:url", async () => {
		const custom = "https://example.com/preferred-url";
		const html = await renderMeta({
			metaData: { ...baseProps.metaData, canonicalURL: custom },
		});
		expect(html).toContain(`<link rel="canonical" href="${custom}">`);
		expect(html).toContain(`<meta property="og:url" content="${custom}">`);
		expect(html).toContain(`<meta name="twitter:url" content="${custom}">`);
	});

	test("omits keywords and author meta when not provided", async () => {
		const html = await renderMeta();
		expect(html).not.toContain('name="keywords"');
		expect(html).not.toContain('name="author"');
	});

	test("omits keywords and author when empty or whitespace-only", async () => {
		const html = await renderMeta({
			metaData: { ...baseProps.metaData, keywords: "   ", authorName: "\t\n" },
		});
		expect(html).not.toContain('name="keywords"');
		expect(html).not.toContain('name="author"');
	});

	test("renders keywords and author when non-empty", async () => {
		const html = await renderMeta({
			metaData: {
				...baseProps.metaData,
				keywords: "astro, vitest",
				authorName: "Ada Lovelace",
			},
		});
		expect(html).toContain('meta name="keywords" content="astro, vitest"');
		expect(html).toContain('meta name="author" content="Ada Lovelace"');
	});

	test("uses custom og title and description when provided", async () => {
		const html = await renderMeta({
			metaData: {
				...baseProps.metaData,
				openGraph: {
					ogTitle: "OG Title",
					ogDescription: "OG Description",
				},
			},
		});
		expect(html).toContain('meta property="og:title" content="OG Title"');
		expect(html).toContain(
			'meta property="og:description" content="OG Description"',
		);
		expect(html).toContain('meta name="twitter:title" content="OG Title"');
		expect(html).toContain(
			'meta name="twitter:description" content="OG Description"',
		);
	});

	test("allows overriding og type and robots", async () => {
		const html = await renderMeta({
			metaData: {
				...baseProps.metaData,
				robots: "noindex, nofollow",
				openGraph: {
					ogType: "article",
				},
			},
		});
		expect(html).toContain('meta property="og:type" content="article"');
		expect(html).toContain('meta name="robots" content="noindex, nofollow"');
	});

	test("sets RSS alternate link with site title", async () => {
		const html = await renderMeta({
			siteTitle: "Chop Logic",
			metaData: { ...baseProps.metaData },
		});
		expect(html).toContain('type="application/rss+xml"');
		expect(html).toContain('title="Chop Logic"');
		expect(html).toContain('href="https://example.com/rss.xml"');
	});
});
