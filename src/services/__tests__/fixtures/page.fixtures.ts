import type {
	AboutMe,
	Article,
	Blog,
	Home,
	PrivacyPolicy,
} from "@api/types/generated";
import type {
	AboutMePageResponse,
	ArticlePageResponse,
	ArticleSlugsResponse,
	BlogPageResponse,
	HomePageResponse,
	PrivacyPolicyPageResponse,
} from "@models";
import {
	createAuthorsConnectionWrapper,
	createMockAuthorsArray,
	createMockCmsImageResponse,
	createMockDynamicZoneContent,
	createMockRichTextContent,
	createMockTagsArray,
} from "../../../mappers/__tests__/fixtures";
import { createMockConfigResponse } from "./config.fixtures";

export function createMockSeoComponent(
	overrides: Partial<{
		metaTitle: string;
		metaDescription: string;
		canonicalURL: string;
		keywords: string;
		authorName: string;
		robots: string;
		structuredData: unknown;
		openGraph: unknown;
	}> = {},
) {
	return {
		__typename: "ComponentSharedSeo",
		id: "seo-123",
		metaTitle: "Page Meta Title",
		metaDescription: "Page meta description for SEO purposes",
		canonicalURL: "https://example.com/page",
		keywords: "keyword1, keyword2, keyword3",
		authorName: "John Doe",
		robots: "index, follow",
		structuredData: null,
		openGraph: {
			__typename: "ComponentSharedOpenGraph",
			id: "og-123",
			ogTitle: "Open Graph Title",
			ogDescription: "Open Graph description",
			ogType: "website",
			ogImage: createMockCmsImageResponse({
				documentId: "og-image-123",
				name: "og-image.jpg",
				width: 1200,
				height: 630,
			}),
		},
		...overrides,
	};
}

function createBaseDynamicPageContent(
	overrides: Partial<{
		documentId: string;
		title: string;
		subTitle: string | null;
		slug: string;
		updatedAt: string;
		content: unknown[];
		metaData: unknown;
	}> = {},
) {
	return {
		documentId: "page-doc-123",
		title: "Page Title",
		subTitle: "Page Subtitle",
		slug: "page-slug",
		updatedAt: "2024-06-15T10:30:00.000Z",
		createdAt: "2024-01-01T00:00:00.000Z",
		publishedAt: "2024-06-15T10:30:00.000Z",
		content: createMockDynamicZoneContent(),
		metaData: createMockSeoComponent(),
		...overrides,
	};
}

export function createMockHomeEntity(overrides: Partial<Home> = {}): Home {
	return {
		__typename: "Home",
		...createBaseDynamicPageContent({
			documentId: "home-doc-123",
			title: "Welcome to Chop Logic",
			subTitle: "A place where logic works",
			slug: "home",
		}),
		...overrides,
	} as Home;
}

/**
 * Creates a mock AboutMe page entity
 */
export function createMockAboutMeEntity(
	overrides: Partial<AboutMe> = {},
): AboutMe {
	return {
		__typename: "AboutMe",
		...createBaseDynamicPageContent({
			documentId: "about-doc-123",
			title: "About Me",
			subTitle: "Learn more about the author",
			slug: "about-me",
		}),
		...overrides,
	} as AboutMe;
}

export function createMockBlogEntity(overrides: Partial<Blog> = {}): Blog {
	return {
		__typename: "Blog",
		...createBaseDynamicPageContent({
			documentId: "blog-doc-123",
			title: "Blog",
			subTitle: "Latest articles and thoughts",
			slug: "blog",
		}),
		...overrides,
	} as Blog;
}

export function createMockPrivacyPolicyEntity(
	overrides: Partial<PrivacyPolicy> = {},
): PrivacyPolicy {
	return {
		__typename: "PrivacyPolicy",
		...createBaseDynamicPageContent({
			documentId: "privacy-doc-123",
			title: "Privacy Policy",
			subTitle: "How we handle your data",
			slug: "privacy-policy",
		}),
		...overrides,
	} as PrivacyPolicy;
}

export function createMockArticleEntity(
	overrides: Partial<Article> = {},
): Article {
	return {
		__typename: "Article",
		...createBaseDynamicPageContent({
			documentId: "article-doc-123",
			title: "Test Article Title",
			subTitle: "Article subtitle goes here",
			slug: "test-article-slug",
		}),
		excerpt: "This is a brief excerpt of the article content for previews.",
		summary: createMockRichTextContent(),
		preview: createMockCmsImageResponse({
			documentId: "preview-img-123",
			name: "article-preview.jpg",
			alternativeText: "Article preview image",
			width: 1200,
			height: 675,
		}),
		tags: createMockTagsArray(3),
		authors: createMockAuthorsArray(2),
		authors_connection: createAuthorsConnectionWrapper(
			createMockAuthorsArray(2),
		),
		publicationDate: "2024-06-15",
		...overrides,
	} as Article;
}

export function createMockArticlesArray(
	count = 3,
	overrides: Partial<Article>[] = [],
): Article[] {
	const defaultArticles = [
		{
			title: "First Article",
			slug: "first-article",
			excerpt: "First article excerpt",
		},
		{
			title: "Second Article",
			slug: "second-article",
			excerpt: "Second article excerpt",
		},
		{
			title: "Third Article",
			slug: "third-article",
			excerpt: "Third article excerpt",
		},
	];

	return Array.from({ length: count }, (_, i) =>
		createMockArticleEntity({
			documentId: `article-${i + 1}`,
			title: defaultArticles[i]?.title ?? `Article ${i + 1}`,
			slug: defaultArticles[i]?.slug ?? `article-${i + 1}`,
			excerpt: defaultArticles[i]?.excerpt ?? `Excerpt for article ${i + 1}`,
			...overrides[i],
		}),
	);
}

// ============================================
// Page Response Fixtures (what the API returns)
// ============================================

export function createMockHomePageResponse(
	overrides: Partial<{ home: Home; config: unknown }> = {},
): HomePageResponse {
	return {
		home: createMockHomeEntity(),
		config: createMockConfigResponse(),
		...overrides,
	} as HomePageResponse;
}

export function createMockAboutMePageResponse(
	overrides: Partial<{ aboutMe: AboutMe; config: unknown }> = {},
): AboutMePageResponse {
	return {
		aboutMe: createMockAboutMeEntity(),
		config: createMockConfigResponse(),
		...overrides,
	} as AboutMePageResponse;
}

export function createMockPrivacyPolicyPageResponse(
	overrides: Partial<{ privacyPolicy: PrivacyPolicy; config: unknown }> = {},
): PrivacyPolicyPageResponse {
	return {
		privacyPolicy: createMockPrivacyPolicyEntity(),
		config: createMockConfigResponse(),
		...overrides,
	} as PrivacyPolicyPageResponse;
}

export function createMockBlogPageResponse(
	overrides: Partial<{
		blog: Blog;
		articles: Article[];
		config: unknown;
	}> = {},
): BlogPageResponse {
	return {
		blog: createMockBlogEntity(),
		articles: createMockArticlesArray(3),
		config: createMockConfigResponse(),
		...overrides,
	} as BlogPageResponse;
}

export function createMockArticlePageResponse(
	overrides: Partial<{ articles: Article[]; config: unknown }> = {},
): ArticlePageResponse {
	return {
		articles: [createMockArticleEntity()],
		config: createMockConfigResponse(),
		...overrides,
	} as ArticlePageResponse;
}

export function createEmptyArticlePageResponse(): ArticlePageResponse {
	return {
		articles: [],
		config: createMockConfigResponse(),
	} as ArticlePageResponse;
}

export function createMockArticleSlugsResponse(
	count = 3,
): ArticleSlugsResponse {
	return {
		articles: Array.from({ length: count }, (_, i) => ({
			slug: `article-slug-${i + 1}`,
			documentId: `article-doc-${i + 1}`,
		})),
	};
}

export function createEmptyArticleSlugsResponse(): ArticleSlugsResponse {
	return {
		articles: [],
	};
}

// ============================================
// Edge Case Fixtures
// ============================================

export function createMinimalHomePageResponse(): HomePageResponse {
	return {
		home: createMockHomeEntity({
			content: [],
			subTitle: null,
		}),
		config: createMockConfigResponse({
			links: [],
			logo: null,
		}),
	} as HomePageResponse;
}

export function createUnicodeHomePageResponse(): HomePageResponse {
	return {
		home: createMockHomeEntity({
			title: "日本語タイトル",
			subTitle: "Ελληνικά υπότιτλος",
			slug: "unicode-page",
		}),
		config: createMockConfigResponse({
			title: "Сайт на русском",
			description: "描述中文",
		}),
	} as HomePageResponse;
}

export function createSpecialCharsArticleResponse(): ArticlePageResponse {
	return {
		articles: [
			createMockArticleEntity({
				title: "C++ & JavaScript: A <Comparison>",
				slug: "cpp-and-javascript-comparison",
				excerpt: 'Testing "quotes" and & ampersands',
			}),
		],
		config: createMockConfigResponse(),
	} as ArticlePageResponse;
}
