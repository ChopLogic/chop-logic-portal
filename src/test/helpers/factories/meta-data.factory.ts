import {
	type MetaData,
	OgType,
	type OpenGraph,
	type OpenGraphImageMeta,
} from "@models";

export function createOpenGraphImage(
	overrides: Partial<OpenGraphImageMeta> = {},
): OpenGraphImageMeta {
	return {
		src: overrides.src ?? "/images/og-default.jpg",
		width: overrides.width ?? 1200,
		height: overrides.height ?? 630,
		...overrides,
	};
}

export function createOpenGraph(overrides: Partial<OpenGraph> = {}): OpenGraph {
	return {
		ogTitle: overrides.ogTitle ?? "Test OG Title",
		ogDescription: overrides.ogDescription ?? "Test OG Description",
		ogType: overrides.ogType ?? OgType.WEBSITE,
		ogImage: overrides.ogImage ?? createOpenGraphImage(),
		...overrides,
	};
}

export function createMetaData(overrides: Partial<MetaData> = {}): MetaData {
	return {
		metaTitle: overrides.metaTitle ?? "Test Page Title",
		metaDescription:
			overrides.metaDescription ?? "Test page description for SEO purposes.",
		openGraph: overrides.openGraph ?? createOpenGraph(),
		...overrides,
	};
}

export function createCompleteMetaData(
	overrides: Partial<MetaData> = {},
): MetaData {
	return createMetaData({
		canonicalURL: "https://example.com/page",
		keywords: "test, keywords, seo",
		authorName: "Test Author",
		robots: "index, follow",
		structuredData: {
			"@context": "https://schema.org",
			"@type": "WebPage",
			name: "Test Page",
		},
		...overrides,
	});
}

export function createMinimalMetaData(
	overrides: Partial<MetaData> = {},
): MetaData {
	return createMetaData({
		openGraph: createOpenGraph({
			ogImage: createOpenGraphImage({
				width: undefined,
				height: undefined,
			}),
		}),
		...overrides,
	});
}

export function createArticleMetaData(
	overrides: Partial<MetaData> = {},
): MetaData {
	return createCompleteMetaData({
		openGraph: createOpenGraph({
			ogType: OgType.ARTICLE,
		}),
		...overrides,
	});
}
