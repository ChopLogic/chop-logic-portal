import { DEFAULT_IMAGE } from "@constants";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { mapArticleToArticlePreview } from "../article";
import {
	createAuthorsConnectionWrapper,
	createMockAuthorConnection,
	createMockAuthorsArray,
	createMockCmsImageResponse,
	createMockTagsArray,
} from "./fixtures";

// Mock dependencies
vi.mock("../normalizers", () => ({
	normalizeRequiredString: vi.fn((v, d) => {
		if (typeof v === "string") return String(v).trim();
		if (!d) throw new Error(`Value ${JSON.stringify(v)} is not a string`);
		return d;
	}),
}));

const mockMapArticleAuthorConnections = vi.fn();

vi.mock("../author", () => ({
	mapArticleAuthorConnections: (...args: unknown[]) =>
		mockMapArticleAuthorConnections(...args),
}));

const mockMapCmsImage = vi.fn();

vi.mock("../image", () => ({
	mapCmsImage: (...args: unknown[]) => mockMapCmsImage(...args),
}));

const mockMapTags = vi.fn();

vi.mock("../tag", () => ({
	mapTags: (...args: unknown[]) => mockMapTags(...args),
}));

const TEST_API_URL = "https://api.example.com";

interface MockArticleEntity {
	documentId: string;
	title: string;
	slug: string;
	excerpt: string;
	preview: ReturnType<typeof createMockCmsImageResponse> | null;
	tags: ReturnType<typeof createMockTagsArray>;
	authors_connection: ReturnType<typeof createAuthorsConnectionWrapper> | null;
}

function createMockArticleEntity(
	overrides: Partial<MockArticleEntity> = {},
): MockArticleEntity {
	return {
		documentId: "article-doc-123",
		title: "Test Article Title",
		slug: "test-article-title",
		excerpt: "This is a brief excerpt of the article content.",
		preview: createMockCmsImageResponse({
			documentId: "preview-img-123",
			name: "article-preview.jpg",
			alternativeText: "Article preview image",
		}),
		tags: createMockTagsArray(2),
		authors_connection: createAuthorsConnectionWrapper(
			createMockAuthorsArray(1),
		),
		...overrides,
	};
}

describe("mapArticleToArticlePreview", () => {
	beforeEach(() => {
		vi.clearAllMocks();

		mockMapArticleAuthorConnections.mockImplementation((connections) => {
			if (!connections) return [];
			return connections.map(
				(conn: {
					documentId: string;
					name: string;
					role?: string;
					avatar?: unknown;
				}) => ({
					id: conn.documentId,
					name: conn.name,
					email: "test@example.com",
					role: conn.role || "Author",
					avatar: conn.avatar
						? {
								documentId: "avatar-id",
								url: "/avatar.jpg",
								width: 400,
								height: 400,
								formats: {
									thumbnail: {
										url: "/avatar-thumb.jpg",
										width: 150,
										height: 150,
									},
								},
							}
						: null,
				}),
			);
		});

		mockMapCmsImage.mockImplementation((raw) => {
			if (!raw) return null;
			return {
				documentId: raw.documentId || "img-id",
				name: raw.name || "image.jpg",
				url: raw.url || "/image.jpg",
				width: raw.width || 1200,
				height: raw.height || 800,
				alternativeText: raw.alternativeText,
				formats: raw.formats || {},
			};
		});

		mockMapTags.mockImplementation((tags) => {
			if (!tags) throw new Error("Invalid tags");
			return tags.map(
				(tag: { documentId: string; name: string; slug: string }) => ({
					id: tag.documentId,
					name: tag.name,
					slug: tag.slug,
				}),
			);
		});
	});

	describe("with complete article data", () => {
		it("maps article to preview with all fields", () => {
			const entity = createMockArticleEntity();
			const result = mapArticleToArticlePreview(entity as never, TEST_API_URL);

			expect(result.id).toBe("article-doc-123");
			expect(result.title).toBe("Test Article Title");
			expect(result.slug).toBe("test-article-title");
			expect(result.summary).toBe(
				"This is a brief excerpt of the article content.",
			);
		});

		it("maps authors correctly", () => {
			const entity = createMockArticleEntity({
				authors_connection: createAuthorsConnectionWrapper(
					createMockAuthorsArray(2),
				),
			});
			const result = mapArticleToArticlePreview(entity as never, TEST_API_URL);

			expect(result.authors).toHaveLength(2);
			expect(mockMapArticleAuthorConnections).toHaveBeenCalledWith(
				entity.authors_connection?.nodes,
				TEST_API_URL,
			);
		});

		it("maps tags correctly", () => {
			const entity = createMockArticleEntity({
				tags: createMockTagsArray(3),
			});
			const result = mapArticleToArticlePreview(entity as never, TEST_API_URL);

			expect(result.tags).toHaveLength(3);
			expect(mockMapTags).toHaveBeenCalledWith(entity.tags);
		});

		it("maps preview image correctly", () => {
			const entity = createMockArticleEntity();
			const result = mapArticleToArticlePreview(entity as never, TEST_API_URL);

			expect(result.image).toBeDefined();
			expect(result.image.loading).toBe("lazy");
			expect(result.image.aspectRatio).toBe("16/9");
			expect(mockMapCmsImage).toHaveBeenCalledWith(
				entity.preview,
				TEST_API_URL,
			);
		});
	});

	describe("author preview mapping", () => {
		it("extracts author name for preview", () => {
			const author = createMockAuthorConnection({ name: "Jane Author" });
			const entity = createMockArticleEntity({
				authors_connection: createAuthorsConnectionWrapper([author]),
			});
			const result = mapArticleToArticlePreview(entity as never, TEST_API_URL);

			expect(result.authors[0]?.name).toBe("Jane Author");
		});

		it("extracts author role as tooltip", () => {
			mockMapArticleAuthorConnections.mockReturnValue([
				{
					id: "author-1",
					name: "John Doe",
					email: "john@example.com",
					role: "Senior Editor",
					avatar: {
						url: "/avatar.jpg",
						formats: { thumbnail: { url: "/thumb.jpg" } },
					},
				},
			]);
			const entity = createMockArticleEntity();
			const result = mapArticleToArticlePreview(entity as never, TEST_API_URL);

			expect(result.authors[0]?.tooltip).toBe("Senior Editor");
		});

		it("uses thumbnail avatar URL when available", () => {
			mockMapArticleAuthorConnections.mockReturnValue([
				{
					id: "author-1",
					name: "John Doe",
					email: "john@example.com",
					avatar: {
						url: "/avatar-original.jpg",
						formats: { thumbnail: { url: "/avatar-thumbnail.jpg" } },
					},
				},
			]);
			const entity = createMockArticleEntity();
			const result = mapArticleToArticlePreview(entity as never, TEST_API_URL);

			expect(result.authors[0]?.imageUrl).toBe("/avatar-thumbnail.jpg");
		});

		it("falls back to original avatar URL when no thumbnail", () => {
			mockMapArticleAuthorConnections.mockReturnValue([
				{
					id: "author-1",
					name: "John Doe",
					email: "john@example.com",
					avatar: {
						url: "/avatar-original.jpg",
						formats: {},
					},
				},
			]);
			const entity = createMockArticleEntity();
			const result = mapArticleToArticlePreview(entity as never, TEST_API_URL);

			expect(result.authors[0]?.imageUrl).toBe("/avatar-original.jpg");
		});

		it("uses empty string when author has no avatar", () => {
			mockMapArticleAuthorConnections.mockReturnValue([
				{
					id: "author-1",
					name: "John Doe",
					email: "john@example.com",
					avatar: null,
				},
			]);
			const entity = createMockArticleEntity();
			const result = mapArticleToArticlePreview(entity as never, TEST_API_URL);

			expect(result.authors[0]?.imageUrl).toBe("");
		});

		it("handles multiple authors", () => {
			mockMapArticleAuthorConnections.mockReturnValue([
				{ id: "author-1", name: "Author One", avatar: null },
				{ id: "author-2", name: "Author Two", avatar: null },
				{ id: "author-3", name: "Author Three", avatar: null },
			]);
			const entity = createMockArticleEntity();
			const result = mapArticleToArticlePreview(entity as never, TEST_API_URL);

			expect(result.authors).toHaveLength(3);
			expect(result.authors[0]?.name).toBe("Author One");
			expect(result.authors[1]?.name).toBe("Author Two");
			expect(result.authors[2]?.name).toBe("Author Three");
		});
	});

	describe("preview image handling", () => {
		it("returns default image when preview is null", () => {
			mockMapCmsImage.mockReturnValue(null);
			const entity = createMockArticleEntity({ preview: null });
			const result = mapArticleToArticlePreview(entity as never, TEST_API_URL);

			expect(result.image).toBeDefined();
			expect(result.image.src).toBeDefined();
		});

		it("uses small format URL when available", () => {
			mockMapCmsImage.mockReturnValue({
				documentId: "img-123",
				url: "/original.jpg",
				width: 1920,
				height: 1080,
				formats: {
					small: { url: "/small.jpg", width: 500, height: 281 },
				},
			});
			const entity = createMockArticleEntity();
			const result = mapArticleToArticlePreview(entity as never, TEST_API_URL);

			expect(result.image.src).toBe("/small.jpg");
		});

		it("falls back to original URL when no small format", () => {
			mockMapCmsImage.mockReturnValue({
				documentId: "img-123",
				url: "/original.jpg",
				width: 1920,
				height: 1080,
				formats: {},
			});
			const entity = createMockArticleEntity();
			const result = mapArticleToArticlePreview(entity as never, TEST_API_URL);

			// Falls through to default image when no small format
			expect(result.image.src).toBeDefined();
		});

		it("falls back to the default image src when preview has no small format and no url", () => {
			mockMapCmsImage.mockReturnValue({
				documentId: "img-123",
				url: undefined,
				width: 1920,
				height: 1080,
				formats: {},
			});
			const entity = createMockArticleEntity();
			const result = mapArticleToArticlePreview(entity as never, TEST_API_URL);

			expect(result.image.src).toBe(DEFAULT_IMAGE.src);
		});

		it("uses alternativeText when available", () => {
			mockMapCmsImage.mockReturnValue({
				documentId: "img-123",
				url: "/image.jpg",
				width: 800,
				height: 600,
				alternativeText: "Custom alt text",
				formats: { small: { url: "/small.jpg" } },
			});
			const entity = createMockArticleEntity();
			const result = mapArticleToArticlePreview(entity as never, TEST_API_URL);

			expect(result.image.alt).toBe("Custom alt text");
		});

		it("uses default alt text when alternativeText is missing", () => {
			mockMapCmsImage.mockReturnValue({
				documentId: "img-123",
				url: "/image.jpg",
				width: 800,
				height: 600,
				formats: { small: { url: "/small.jpg" } },
			});
			const entity = createMockArticleEntity();
			const result = mapArticleToArticlePreview(entity as never, TEST_API_URL);

			expect(result.image.alt).toBe("Chop Logic Image");
		});

		it("sets aspectRatio to 16/9", () => {
			const entity = createMockArticleEntity();
			const result = mapArticleToArticlePreview(entity as never, TEST_API_URL);

			expect(result.image.aspectRatio).toBe("16/9");
		});

		it("sets loading to lazy", () => {
			const entity = createMockArticleEntity();
			const result = mapArticleToArticlePreview(entity as never, TEST_API_URL);

			expect(result.image.loading).toBe("lazy");
		});
	});

	describe("field extraction", () => {
		it("uses documentId as id", () => {
			const entity = createMockArticleEntity({
				documentId: "custom-article-id",
			});
			const result = mapArticleToArticlePreview(entity as never, TEST_API_URL);

			expect(result.id).toBe("custom-article-id");
		});

		it("preserves title", () => {
			const entity = createMockArticleEntity({ title: "Custom Article Title" });
			const result = mapArticleToArticlePreview(entity as never, TEST_API_URL);

			expect(result.title).toBe("Custom Article Title");
		});

		it("preserves slug", () => {
			const entity = createMockArticleEntity({ slug: "custom-slug" });
			const result = mapArticleToArticlePreview(entity as never, TEST_API_URL);

			expect(result.slug).toBe("custom-slug");
		});

		it("maps excerpt to summary", () => {
			const entity = createMockArticleEntity({
				excerpt: "Custom excerpt for the article.",
			});
			const result = mapArticleToArticlePreview(entity as never, TEST_API_URL);

			expect(result.summary).toBe("Custom excerpt for the article.");
		});
	});

	describe("edge cases", () => {
		it("handles article with no tags", () => {
			mockMapTags.mockReturnValue([]);
			const entity = createMockArticleEntity({ tags: [] });
			const result = mapArticleToArticlePreview(entity as never, TEST_API_URL);

			expect(result.tags).toEqual([]);
		});

		it("handles article with no authors", () => {
			mockMapArticleAuthorConnections.mockReturnValue([]);
			const entity = createMockArticleEntity({
				authors_connection: createAuthorsConnectionWrapper([]),
			});
			const result = mapArticleToArticlePreview(entity as never, TEST_API_URL);

			expect(result.authors).toEqual([]);
		});

		it("handles special characters in title and slug", () => {
			const entity = createMockArticleEntity({
				title: "C++ & JavaScript: A Comparison",
				slug: "cpp-and-javascript-comparison",
			});
			const result = mapArticleToArticlePreview(entity as never, TEST_API_URL);

			expect(result.title).toBe("C++ & JavaScript: A Comparison");
			expect(result.slug).toBe("cpp-and-javascript-comparison");
		});

		it("handles unicode characters", () => {
			const entity = createMockArticleEntity({
				title: "日本語の記事タイトル",
				excerpt: "これは日本語の記事の抜粋です。",
			});
			const result = mapArticleToArticlePreview(entity as never, TEST_API_URL);

			expect(result.title).toBe("日本語の記事タイトル");
			expect(result.summary).toBe("これは日本語の記事の抜粋です。");
		});
	});
});
