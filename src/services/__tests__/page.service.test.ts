import {
	ABOUT_ME_PAGE_QUERY,
	ARTICLE_PAGE_BY_SLUG_QUERY,
	ARTICLE_SLUGS_QUERY,
	BLOG_PAGE_QUERY,
	HOME_PAGE_QUERY,
	PRIVACY_POLICY_PAGE_QUERY,
} from "@api/queries";
import { DEFAULT_SITE_DESCRIPTION, DEFAULT_SITE_TITLE } from "@constants";
import type { Client } from "@models";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { TEST_API_URL } from "../../test/constants";
import { createMockClient, type MockClient } from "../../test/helpers";
import { NotFoundError } from "../errors";
import { PageService } from "../page.service";
import {
	createEmptyArticlePageResponse,
	createEmptyArticleSlugsResponse,
	createMinimalHomePageResponse,
	createMockAboutMePageResponse,
	createMockArticleEntity,
	createMockArticlePageResponse,
	createMockArticleSlugsResponse,
	createMockBlogPageResponse,
	createMockHomePageResponse,
	createMockPrivacyPolicyPageResponse,
	createSpecialCharsArticleResponse,
	createUnicodeHomePageResponse,
} from "./fixtures";

describe("PageService", () => {
	let mockClient: MockClient;
	let pageService: PageService;

	beforeEach(() => {
		vi.clearAllMocks();
		mockClient = createMockClient();
		pageService = new PageService(mockClient as Client, {
			apiUrl: TEST_API_URL,
		});
	});

	// ============================================
	// Core Mapping Logic Tests
	// ============================================

	describe("mapConfigToCorePageData (tested indirectly)", () => {
		it("maps config title to siteTitle", async () => {
			const response = createMockHomePageResponse();
			mockClient.executeQuery.mockResolvedValue(response);

			const result = await pageService.getHomePage();

			expect(result.siteTitle).toBe(response.config.title);
		});

		it("uses default site title when config title is null/undefined", async () => {
			const response = createMockHomePageResponse();
			// @ts-expect-error - testing null/undefined handling
			response.config.title = null;
			mockClient.executeQuery.mockResolvedValue(response);

			const result = await pageService.getHomePage();

			expect(result.siteTitle).toBe(DEFAULT_SITE_TITLE);
		});

		it("returns empty string when config title is empty", async () => {
			const response = createMockHomePageResponse();
			response.config.title = "";
			mockClient.executeQuery.mockResolvedValue(response);

			const result = await pageService.getHomePage();

			// normalizeRequiredString returns trimmed string, even if empty
			expect(result.siteTitle).toBe("");
		});

		it("maps config description to description", async () => {
			const response = createMockHomePageResponse();
			mockClient.executeQuery.mockResolvedValue(response);

			const result = await pageService.getHomePage();

			expect(result.description).toBe(response.config.description);
		});

		it("uses default description when config description is null/undefined", async () => {
			const response = createMockHomePageResponse();
			// @ts-expect-error - testing null/undefined handling
			response.config.description = null;
			mockClient.executeQuery.mockResolvedValue(response);

			const result = await pageService.getHomePage();

			expect(result.description).toBe(DEFAULT_SITE_DESCRIPTION);
		});

		it("returns empty string when config description is empty", async () => {
			const response = createMockHomePageResponse();
			response.config.description = "";
			mockClient.executeQuery.mockResolvedValue(response);

			const result = await pageService.getHomePage();

			// normalizeRequiredString returns trimmed string, even if empty
			expect(result.description).toBe("");
		});

		it("maps footer rich text content", async () => {
			const response = createMockHomePageResponse();
			mockClient.executeQuery.mockResolvedValue(response);

			const result = await pageService.getHomePage();

			expect(result.footer).toBeDefined();
			expect(Array.isArray(result.footer)).toBe(true);
		});

		it("maps links array", async () => {
			const response = createMockHomePageResponse();
			mockClient.executeQuery.mockResolvedValue(response);

			const result = await pageService.getHomePage();

			expect(result.links).toBeDefined();
			expect(Array.isArray(result.links)).toBe(true);
			expect(result.links.length).toBeGreaterThan(0);
		});

		it("handles empty links array", async () => {
			const response = createMinimalHomePageResponse();
			mockClient.executeQuery.mockResolvedValue(response);

			const result = await pageService.getHomePage();

			expect(result.links).toEqual([]);
		});

		it("maps logo image with absolute URL", async () => {
			const response = createMockHomePageResponse();
			mockClient.executeQuery.mockResolvedValue(response);

			const result = await pageService.getHomePage();

			expect(result.logo).not.toBeNull();
			expect(result.logo?.url).toContain(TEST_API_URL);
		});

		it("handles null logo", async () => {
			const response = createMinimalHomePageResponse();
			mockClient.executeQuery.mockResolvedValue(response);

			const result = await pageService.getHomePage();

			expect(result.logo).toBeNull();
		});
	});

	describe("mapResponseToDynamicPageData (tested indirectly)", () => {
		it("maps documentId to id", async () => {
			const response = createMockHomePageResponse();
			mockClient.executeQuery.mockResolvedValue(response);

			const result = await pageService.getHomePage();

			expect(result.id).toBe(response.home.documentId);
		});

		it("maps title field", async () => {
			const response = createMockHomePageResponse();
			mockClient.executeQuery.mockResolvedValue(response);

			const result = await pageService.getHomePage();

			expect(result.title).toBe(response.home.title);
		});

		it("maps subTitle field", async () => {
			const response = createMockHomePageResponse();
			mockClient.executeQuery.mockResolvedValue(response);

			const result = await pageService.getHomePage();

			expect(result.subTitle).toBe(response.home.subTitle);
		});

		it("handles null subTitle", async () => {
			const response = createMinimalHomePageResponse();
			mockClient.executeQuery.mockResolvedValue(response);

			const result = await pageService.getHomePage();

			expect(result.subTitle).toBeUndefined();
		});

		it("maps slug field", async () => {
			const response = createMockHomePageResponse();
			mockClient.executeQuery.mockResolvedValue(response);

			const result = await pageService.getHomePage();

			expect(result.slug).toBe(response.home.slug);
		});

		it("maps updatedAt as Date", async () => {
			const response = createMockHomePageResponse();
			mockClient.executeQuery.mockResolvedValue(response);

			const result = await pageService.getHomePage();

			expect(result.updatedAt).toBeInstanceOf(Date);
		});

		it("maps dynamic zone content", async () => {
			const response = createMockHomePageResponse();
			mockClient.executeQuery.mockResolvedValue(response);

			const result = await pageService.getHomePage();

			expect(result.content).toBeDefined();
			expect(Array.isArray(result.content)).toBe(true);
		});

		it("handles empty content array", async () => {
			const response = createMinimalHomePageResponse();
			mockClient.executeQuery.mockResolvedValue(response);

			const result = await pageService.getHomePage();

			expect(result.content).toEqual([]);
		});

		it("maps metaData correctly", async () => {
			const response = createMockHomePageResponse();
			mockClient.executeQuery.mockResolvedValue(response);

			const result = await pageService.getHomePage();

			expect(result.metaData).toBeDefined();
			expect(result.metaData.metaTitle).toBeDefined();
			expect(result.metaData.metaDescription).toBeDefined();
			expect(result.metaData.openGraph).toBeDefined();
		});
	});

	// ============================================
	// getHomePage Tests
	// ============================================

	describe("getHomePage", () => {
		it("calls client with HOME_PAGE_QUERY", async () => {
			const response = createMockHomePageResponse();
			mockClient.executeQuery.mockResolvedValue(response);

			await pageService.getHomePage();

			expect(mockClient.executeQuery).toHaveBeenCalledWith(HOME_PAGE_QUERY);
		});

		it("returns correctly structured DynamicContentPageData", async () => {
			const response = createMockHomePageResponse();
			mockClient.executeQuery.mockResolvedValue(response);

			const result = await pageService.getHomePage();

			// Core page data
			expect(result).toHaveProperty("siteTitle");
			expect(result).toHaveProperty("description");
			expect(result).toHaveProperty("footer");
			expect(result).toHaveProperty("links");
			expect(result).toHaveProperty("logo");

			// Dynamic content page data
			expect(result).toHaveProperty("id");
			expect(result).toHaveProperty("title");
			expect(result).toHaveProperty("slug");
			expect(result).toHaveProperty("updatedAt");
			expect(result).toHaveProperty("content");
			expect(result).toHaveProperty("metaData");
		});

		it("maps complete home page data correctly", async () => {
			const response = createMockHomePageResponse();
			mockClient.executeQuery.mockResolvedValue(response);

			const result = await pageService.getHomePage();

			expect(result.id).toBe("home-doc-123");
			expect(result.title).toBe("Welcome to Chop Logic");
			expect(result.slug).toBe("home");
		});

		it("handles minimal home page response", async () => {
			const response = createMinimalHomePageResponse();
			mockClient.executeQuery.mockResolvedValue(response);

			const result = await pageService.getHomePage();

			expect(result).toBeDefined();
			expect(result.content).toEqual([]);
		});

		it("handles unicode content in home page", async () => {
			const response = createUnicodeHomePageResponse();
			mockClient.executeQuery.mockResolvedValue(response);

			const result = await pageService.getHomePage();

			expect(result.title).toBe("日本語タイトル");
			expect(result.subTitle).toBe("Ελληνικά υπότιτλος");
		});
	});

	// ============================================
	// getAboutMePage Tests
	// ============================================

	describe("getAboutMePage", () => {
		it("calls client with ABOUT_ME_PAGE_QUERY", async () => {
			const response = createMockAboutMePageResponse();
			mockClient.executeQuery.mockResolvedValue(response);

			await pageService.getAboutMePage();

			expect(mockClient.executeQuery).toHaveBeenCalledWith(ABOUT_ME_PAGE_QUERY);
		});

		it("returns correctly structured DynamicContentPageData", async () => {
			const response = createMockAboutMePageResponse();
			mockClient.executeQuery.mockResolvedValue(response);

			const result = await pageService.getAboutMePage();

			expect(result).toHaveProperty("id");
			expect(result).toHaveProperty("title");
			expect(result).toHaveProperty("slug");
			expect(result).toHaveProperty("content");
			expect(result).toHaveProperty("metaData");
		});

		it("maps about me page data correctly", async () => {
			const response = createMockAboutMePageResponse();
			mockClient.executeQuery.mockResolvedValue(response);

			const result = await pageService.getAboutMePage();

			expect(result.id).toBe("about-doc-123");
			expect(result.title).toBe("About Me");
			expect(result.slug).toBe("about-me");
		});
	});

	// ============================================
	// getPrivacyPolicyPage Tests
	// ============================================

	describe("getPrivacyPolicyPage", () => {
		it("calls client with PRIVACY_POLICY_PAGE_QUERY", async () => {
			const response = createMockPrivacyPolicyPageResponse();
			mockClient.executeQuery.mockResolvedValue(response);

			await pageService.getPrivacyPolicyPage();

			expect(mockClient.executeQuery).toHaveBeenCalledWith(
				PRIVACY_POLICY_PAGE_QUERY,
			);
		});

		it("returns correctly structured DynamicContentPageData", async () => {
			const response = createMockPrivacyPolicyPageResponse();
			mockClient.executeQuery.mockResolvedValue(response);

			const result = await pageService.getPrivacyPolicyPage();

			expect(result).toHaveProperty("id");
			expect(result).toHaveProperty("title");
			expect(result).toHaveProperty("slug");
			expect(result).toHaveProperty("content");
		});

		it("maps privacy policy page data correctly", async () => {
			const response = createMockPrivacyPolicyPageResponse();
			mockClient.executeQuery.mockResolvedValue(response);

			const result = await pageService.getPrivacyPolicyPage();

			expect(result.id).toBe("privacy-doc-123");
			expect(result.title).toBe("Privacy Policy");
			expect(result.slug).toBe("privacy-policy");
		});
	});

	// ============================================
	// getBlogPage Tests
	// ============================================

	describe("getBlogPage", () => {
		it("calls client with BLOG_PAGE_QUERY", async () => {
			const response = createMockBlogPageResponse();
			mockClient.executeQuery.mockResolvedValue(response);

			await pageService.getBlogPage();

			expect(mockClient.executeQuery).toHaveBeenCalledWith(BLOG_PAGE_QUERY);
		});

		it("returns BlogPageData with previews array", async () => {
			const response = createMockBlogPageResponse();
			mockClient.executeQuery.mockResolvedValue(response);

			const result = await pageService.getBlogPage();

			expect(result).toHaveProperty("previews");
			expect(Array.isArray(result.previews)).toBe(true);
		});

		it("maps articles to article previews", async () => {
			const response = createMockBlogPageResponse();
			mockClient.executeQuery.mockResolvedValue(response);

			const result = await pageService.getBlogPage();

			expect(result.previews.length).toBe(3);
		});

		it("maps article preview structure correctly", async () => {
			const response = createMockBlogPageResponse();
			mockClient.executeQuery.mockResolvedValue(response);

			const result = await pageService.getBlogPage();
			const preview = result.previews[0];

			expect(preview).toHaveProperty("id");
			expect(preview).toHaveProperty("slug");
			expect(preview).toHaveProperty("title");
			expect(preview).toHaveProperty("image");
			expect(preview).toHaveProperty("authors");
			expect(preview).toHaveProperty("tags");
		});

		it("handles empty articles array", async () => {
			const response = createMockBlogPageResponse({ articles: [] });
			mockClient.executeQuery.mockResolvedValue(response);

			const result = await pageService.getBlogPage();

			expect(result.previews).toEqual([]);
		});

		it("maps blog page data correctly", async () => {
			const response = createMockBlogPageResponse();
			mockClient.executeQuery.mockResolvedValue(response);

			const result = await pageService.getBlogPage();

			expect(result.id).toBe("blog-doc-123");
			expect(result.title).toBe("Blog");
			expect(result.slug).toBe("blog");
		});

		it("includes core page data in blog page", async () => {
			const response = createMockBlogPageResponse();
			mockClient.executeQuery.mockResolvedValue(response);

			const result = await pageService.getBlogPage();

			expect(result.siteTitle).toBeDefined();
			expect(result.description).toBeDefined();
			expect(result.footer).toBeDefined();
			expect(result.links).toBeDefined();
		});
	});

	// ============================================
	// getArticlePageBySlug Tests
	// ============================================

	describe("getArticlePageBySlug", () => {
		it("calls client with ARTICLE_PAGE_BY_SLUG_QUERY and slug variable", async () => {
			const response = createMockArticlePageResponse();
			mockClient.executeQuery.mockResolvedValue(response);

			await pageService.getArticlePageBySlug("test-article-slug");

			expect(mockClient.executeQuery).toHaveBeenCalledWith(
				ARTICLE_PAGE_BY_SLUG_QUERY,
				{ slug: "test-article-slug" },
			);
		});

		it("returns ArticlePageData with summary and tags", async () => {
			const response = createMockArticlePageResponse();
			mockClient.executeQuery.mockResolvedValue(response);

			const result = await pageService.getArticlePageBySlug("test-slug");

			expect(result).toHaveProperty("summary");
			expect(result).toHaveProperty("tags");
		});

		it("maps summary as rich text content", async () => {
			const response = createMockArticlePageResponse();
			mockClient.executeQuery.mockResolvedValue(response);

			const result = await pageService.getArticlePageBySlug("test-slug");

			expect(Array.isArray(result.summary)).toBe(true);
		});

		it("maps tags array", async () => {
			const response = createMockArticlePageResponse();
			mockClient.executeQuery.mockResolvedValue(response);

			const result = await pageService.getArticlePageBySlug("test-slug");

			expect(Array.isArray(result.tags)).toBe(true);
			expect(result.tags.length).toBeGreaterThan(0);
		});

		it("maps tag structure correctly", async () => {
			const response = createMockArticlePageResponse();
			mockClient.executeQuery.mockResolvedValue(response);

			const result = await pageService.getArticlePageBySlug("test-slug");
			const tag = result.tags[0];

			expect(tag).toHaveProperty("id");
			expect(tag).toHaveProperty("name");
			expect(tag).toHaveProperty("slug");
		});

		it("throws NotFoundError when article is not found", async () => {
			const response = createEmptyArticlePageResponse();
			mockClient.executeQuery.mockResolvedValue(response);

			await expect(
				pageService.getArticlePageBySlug("non-existent-slug"),
			).rejects.toThrow(NotFoundError);
		});

		it("throws NotFoundError with correct resource and identifier", async () => {
			const response = createEmptyArticlePageResponse();
			mockClient.executeQuery.mockResolvedValue(response);

			await expect(
				pageService.getArticlePageBySlug("missing-article"),
			).rejects.toThrow('Article with identifier "missing-article" not found');
		});

		it("handles slug with special characters", async () => {
			const response = createSpecialCharsArticleResponse();
			mockClient.executeQuery.mockResolvedValue(response);

			const result = await pageService.getArticlePageBySlug(
				"cpp-and-javascript-comparison",
			);

			expect(result.title).toBe("C++ & JavaScript: A <Comparison>");
		});

		it("includes core page data in article page", async () => {
			const response = createMockArticlePageResponse();
			mockClient.executeQuery.mockResolvedValue(response);

			const result = await pageService.getArticlePageBySlug("test-slug");

			expect(result.siteTitle).toBeDefined();
			expect(result.description).toBeDefined();
			expect(result.footer).toBeDefined();
			expect(result.links).toBeDefined();
		});

		it("includes dynamic content page data in article page", async () => {
			const response = createMockArticlePageResponse();
			mockClient.executeQuery.mockResolvedValue(response);

			const result = await pageService.getArticlePageBySlug("test-slug");

			expect(result.id).toBeDefined();
			expect(result.title).toBeDefined();
			expect(result.slug).toBeDefined();
			expect(result.updatedAt).toBeDefined();
			expect(result.content).toBeDefined();
			expect(result.metaData).toBeDefined();
		});
	});

	// ============================================
	// getArticleSlugs Tests
	// ============================================

	describe("getArticleSlugs", () => {
		it("calls client with ARTICLE_SLUGS_QUERY", async () => {
			const response = createMockArticleSlugsResponse();
			mockClient.executeQuery.mockResolvedValue(response);

			await pageService.getArticleSlugs();

			expect(mockClient.executeQuery).toHaveBeenCalledWith(ARTICLE_SLUGS_QUERY);
		});

		it("returns array of slug strings", async () => {
			const response = createMockArticleSlugsResponse();
			mockClient.executeQuery.mockResolvedValue(response);

			const result = await pageService.getArticleSlugs();

			expect(Array.isArray(result)).toBe(true);
			expect(result.every((slug) => typeof slug === "string")).toBe(true);
		});

		it("extracts only slugs from articles", async () => {
			const response = createMockArticleSlugsResponse(3);
			mockClient.executeQuery.mockResolvedValue(response);

			const result = await pageService.getArticleSlugs();

			expect(result).toEqual([
				"article-slug-1",
				"article-slug-2",
				"article-slug-3",
			]);
		});

		it("returns empty array when no articles exist", async () => {
			const response = createEmptyArticleSlugsResponse();
			mockClient.executeQuery.mockResolvedValue(response);

			const result = await pageService.getArticleSlugs();

			expect(result).toEqual([]);
		});

		it("handles large number of articles", async () => {
			const response = createMockArticleSlugsResponse(100);
			mockClient.executeQuery.mockResolvedValue(response);

			const result = await pageService.getArticleSlugs();

			expect(result.length).toBe(100);
		});
	});

	// ============================================
	// Edge Cases and Integration Tests
	// ============================================

	describe("edge cases", () => {
		it("resolves image URLs with apiUrl prefix for relative paths", async () => {
			const response = createMockHomePageResponse();
			mockClient.executeQuery.mockResolvedValue(response);

			const result = await pageService.getHomePage();

			if (result.logo) {
				expect(result.logo.url).toContain(TEST_API_URL);
			}
		});

		it("handles articles with empty tags array", async () => {
			const response = createMockArticlePageResponse({
				articles: [
					createMockArticleEntity({
						tags: [],
					}),
				],
			});
			mockClient.executeQuery.mockResolvedValue(response);

			const result = await pageService.getArticlePageBySlug("test-slug");

			expect(result.tags).toEqual([]);
		});

		it("handles articles with empty authors connection", async () => {
			const response = createMockArticlePageResponse({
				articles: [
					createMockArticleEntity({
						authors_connection: { nodes: [] },
					}),
				],
			});
			mockClient.executeQuery.mockResolvedValue(response);

			// Should not throw
			const result = await pageService.getArticlePageBySlug("test-slug");
			expect(result).toBeDefined();
		});

		it("propagates client errors", async () => {
			const clientError = new Error("Network error");
			mockClient.executeQuery.mockRejectedValue(clientError);

			await expect(pageService.getHomePage()).rejects.toThrow("Network error");
		});

		it("creates new service instance with different apiUrl", async () => {
			const differentApiUrl = "https://different-api.example.com";
			const service = new PageService(mockClient as Client, {
				apiUrl: differentApiUrl,
			});
			const response = createMockHomePageResponse();
			mockClient.executeQuery.mockResolvedValue(response);

			const result = await service.getHomePage();

			if (result.logo) {
				expect(result.logo.url).toContain(differentApiUrl);
			}
		});
	});

	describe("dynamic zone content mapping", () => {
		it("maps paragraph components in content", async () => {
			const response = createMockHomePageResponse();
			mockClient.executeQuery.mockResolvedValue(response);

			const result = await pageService.getHomePage();

			const paragraphContent = result.content.find(
				(item) => item.type === "paragraph",
			);
			expect(paragraphContent).toBeDefined();
		});

		it("maps embedded video components in content", async () => {
			const response = createMockHomePageResponse();
			mockClient.executeQuery.mockResolvedValue(response);

			const result = await pageService.getHomePage();

			const videoContent = result.content.find(
				(item) => item.type === "embedded-video",
			);
			expect(videoContent).toBeDefined();
		});

		it("maps gallery components in content", async () => {
			const response = createMockHomePageResponse();
			mockClient.executeQuery.mockResolvedValue(response);

			const result = await pageService.getHomePage();

			const galleryContent = result.content.find(
				(item) => item.type === "gallery",
			);
			expect(galleryContent).toBeDefined();
		});

		it("maps call to action components in content", async () => {
			const response = createMockHomePageResponse();
			mockClient.executeQuery.mockResolvedValue(response);

			const result = await pageService.getHomePage();

			const ctaContent = result.content.find(
				(item) => item.type === "call-to-action",
			);
			expect(ctaContent).toBeDefined();
		});

		it("maps reference list components in content", async () => {
			const response = createMockHomePageResponse();
			mockClient.executeQuery.mockResolvedValue(response);

			const result = await pageService.getHomePage();

			const refListContent = result.content.find(
				(item) => item.type === "reference-list",
			);
			expect(refListContent).toBeDefined();
		});
	});
});
