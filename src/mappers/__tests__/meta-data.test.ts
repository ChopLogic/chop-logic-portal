import { OgType } from "@models";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { mapMetaData } from "../meta-data";
import { createMockCmsImageResponse } from "./fixtures";

// Mock dependencies
vi.mock("../checkers", () => ({
	isRecord: vi.fn(
		(v) => typeof v === "object" && v !== null && !Array.isArray(v),
	),
}));

vi.mock("../normalizers", () => ({
	normalizeRequiredString: vi.fn((v, d) => {
		if (typeof v === "string") return String(v).trim();
		if (!d) throw new Error(`Value ${JSON.stringify(v)} is not a string`);
		return d;
	}),
	normalizeOptionalString: vi.fn((v, d) => {
		if (!v || typeof v === "object") return d;
		return String(v).trim();
	}),
}));

const mockMapCmsImage = vi.fn();
const mockPickOpenGraphCmsImage = vi.fn();

vi.mock("../image", () => ({
	mapCmsImage: (...args: unknown[]) => mockMapCmsImage(...args),
	pickOpenGraphCmsImage: (...args: unknown[]) =>
		mockPickOpenGraphCmsImage(...args),
}));

const TEST_API_URL = "https://api.example.com";

describe("mapMetaData", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockMapCmsImage.mockImplementation((raw) => {
			if (!raw || typeof raw !== "object") return null;
			return {
				documentId: "og-image-id",
				name: "og-image.jpg",
				url: "/uploads/og-image.jpg",
				width: 1200,
				height: 630,
				formats: {},
			};
		});
		mockPickOpenGraphCmsImage.mockImplementation((img) => ({
			src: img?.url || "/fallback.jpg",
			width: img?.width || 1200,
			height: img?.height || 630,
		}));
	});

	describe("with valid metadata object", () => {
		it("maps complete metadata", () => {
			const raw = {
				metaTitle: "Test Page Title",
				metaDescription: "Test page description for SEO",
				keywords: "test, seo, keywords",
				authorName: "John Doe",
				canonicalURL: "https://example.com/test-page",
				robots: "index, follow",
				openGraph: {
					ogTitle: "OG Title",
					ogDescription: "OG Description",
					ogType: "article",
					ogImage: createMockCmsImageResponse(),
				},
			};
			const result = mapMetaData(raw, TEST_API_URL);

			expect(result.metaTitle).toBe("Test Page Title");
			expect(result.metaDescription).toBe("Test page description for SEO");
			expect(result.keywords).toBe("test, seo, keywords");
			expect(result.authorName).toBe("John Doe");
			expect(result.canonicalURL).toBe("https://example.com/test-page");
			expect(result.robots).toBe("index, follow");
		});

		it("maps metadata with minimal fields", () => {
			const raw = {
				metaTitle: "Simple Title",
				metaDescription: "Simple description",
			};
			const result = mapMetaData(raw, TEST_API_URL);

			expect(result.metaTitle).toBe("Simple Title");
			expect(result.metaDescription).toBe("Simple description");
		});

		it("preserves structuredData as-is", () => {
			const structuredData = {
				"@context": "https://schema.org",
				"@type": "Article",
			};
			const raw = {
				metaTitle: "Title",
				metaDescription: "Description",
				structuredData,
			};
			const result = mapMetaData(raw, TEST_API_URL);

			expect(result.structuredData).toEqual(structuredData);
		});
	});

	describe("default values", () => {
		it("returns defaults for non-record input", () => {
			const result = mapMetaData(null, TEST_API_URL);

			expect(result.metaTitle).toBe("Chop Logic");
			expect(result.metaDescription).toBe("A place where logic works");
			expect(result.robots).toBe("index, follow");
		});

		it("returns defaults for undefined input", () => {
			const result = mapMetaData(undefined, TEST_API_URL);

			expect(result.metaTitle).toBe("Chop Logic");
			expect(result.metaDescription).toBe("A place where logic works");
		});

		it("returns defaults for array input", () => {
			const result = mapMetaData([], TEST_API_URL);

			expect(result.metaTitle).toBe("Chop Logic");
		});

		it("returns defaults for string input", () => {
			const result = mapMetaData("string", TEST_API_URL);

			expect(result.metaTitle).toBe("Chop Logic");
		});

		it("uses default metaTitle when missing", () => {
			const raw = {
				metaDescription: "Has description",
			};
			const result = mapMetaData(raw, TEST_API_URL);

			expect(result.metaTitle).toBe("Chop Logic");
		});

		it("uses default metaDescription when missing", () => {
			const raw = {
				metaTitle: "Has title",
			};
			const result = mapMetaData(raw, TEST_API_URL);

			expect(result.metaDescription).toBe("A place where logic works");
		});

		it("uses default robots when missing", () => {
			const raw = {
				metaTitle: "Title",
				metaDescription: "Description",
			};
			const result = mapMetaData(raw, TEST_API_URL);

			expect(result.robots).toBe("index, follow");
		});
	});

	describe("optional fields", () => {
		it("returns undefined for missing optional fields", () => {
			const raw = {
				metaTitle: "Title",
				metaDescription: "Description",
			};
			const result = mapMetaData(raw, TEST_API_URL);

			expect(result.keywords).toBeUndefined();
			expect(result.authorName).toBeUndefined();
			expect(result.canonicalURL).toBeUndefined();
		});

		it("maps keywords when provided", () => {
			const raw = {
				metaTitle: "Title",
				metaDescription: "Description",
				keywords: "keyword1, keyword2, keyword3",
			};
			const result = mapMetaData(raw, TEST_API_URL);

			expect(result.keywords).toBe("keyword1, keyword2, keyword3");
		});

		it("maps authorName when provided", () => {
			const raw = {
				metaTitle: "Title",
				metaDescription: "Description",
				authorName: "Jane Smith",
			};
			const result = mapMetaData(raw, TEST_API_URL);

			expect(result.authorName).toBe("Jane Smith");
		});

		it("maps canonicalURL when provided", () => {
			const raw = {
				metaTitle: "Title",
				metaDescription: "Description",
				canonicalURL: "https://example.com/canonical",
			};
			const result = mapMetaData(raw, TEST_API_URL);

			expect(result.canonicalURL).toBe("https://example.com/canonical");
		});
	});

	describe("OpenGraph mapping", () => {
		it("maps complete OpenGraph data", () => {
			const raw = {
				metaTitle: "Title",
				metaDescription: "Description",
				openGraph: {
					ogTitle: "OG Title",
					ogDescription: "OG Description",
					ogType: "article",
					ogImage: createMockCmsImageResponse(),
				},
			};
			const result = mapMetaData(raw, TEST_API_URL);

			expect(result.openGraph.ogTitle).toBe("OG Title");
			expect(result.openGraph.ogDescription).toBe("OG Description");
			expect(result.openGraph.ogType).toBe(OgType.ARTICLE);
		});

		it("returns default OpenGraph for non-record openGraph field", () => {
			const raw = {
				metaTitle: "Title",
				metaDescription: "Description",
				openGraph: "not an object",
			};
			const result = mapMetaData(raw, TEST_API_URL);

			expect(result.openGraph.ogTitle).toBe("Chop Logic");
			expect(result.openGraph.ogDescription).toBe("A place where logic works");
			expect(result.openGraph.ogType).toBe(OgType.WEBSITE);
		});

		it("returns default OpenGraph when missing", () => {
			const raw = {
				metaTitle: "Title",
				metaDescription: "Description",
			};
			const result = mapMetaData(raw, TEST_API_URL);

			expect(result.openGraph).toBeDefined();
			expect(result.openGraph.ogType).toBe(OgType.WEBSITE);
		});

		describe("ogType normalization", () => {
			it("normalizes 'article' to OgType.ARTICLE", () => {
				const raw = {
					metaTitle: "Title",
					metaDescription: "Description",
					openGraph: {
						ogTitle: "Title",
						ogDescription: "Desc",
						ogType: "article",
					},
				};
				const result = mapMetaData(raw, TEST_API_URL);

				expect(result.openGraph.ogType).toBe(OgType.ARTICLE);
			});

			it("normalizes 'website' to OgType.WEBSITE", () => {
				const raw = {
					metaTitle: "Title",
					metaDescription: "Description",
					openGraph: {
						ogTitle: "Title",
						ogDescription: "Desc",
						ogType: "website",
					},
				};
				const result = mapMetaData(raw, TEST_API_URL);

				expect(result.openGraph.ogType).toBe(OgType.WEBSITE);
			});

			it("defaults to WEBSITE for unknown ogType", () => {
				const raw = {
					metaTitle: "Title",
					metaDescription: "Description",
					openGraph: {
						ogTitle: "Title",
						ogDescription: "Desc",
						ogType: "unknown",
					},
				};
				const result = mapMetaData(raw, TEST_API_URL);

				expect(result.openGraph.ogType).toBe(OgType.WEBSITE);
			});

			it("defaults to WEBSITE for null ogType", () => {
				const raw = {
					metaTitle: "Title",
					metaDescription: "Description",
					openGraph: {
						ogTitle: "Title",
						ogDescription: "Desc",
						ogType: null,
					},
				};
				const result = mapMetaData(raw, TEST_API_URL);

				expect(result.openGraph.ogType).toBe(OgType.WEBSITE);
			});
		});

		describe("ogImage mapping", () => {
			it("maps ogImage through mapCmsImage and pickOpenGraphCmsImage", () => {
				const ogImageRaw = createMockCmsImageResponse();
				const raw = {
					metaTitle: "Title",
					metaDescription: "Description",
					openGraph: {
						ogTitle: "Title",
						ogDescription: "Desc",
						ogType: "article",
						ogImage: ogImageRaw,
					},
				};
				mapMetaData(raw, TEST_API_URL);

				expect(mockMapCmsImage).toHaveBeenCalledWith(ogImageRaw, TEST_API_URL);
			});

			it("returns fallback image for non-record ogImage", () => {
				const raw = {
					metaTitle: "Title",
					metaDescription: "Description",
					openGraph: {
						ogTitle: "Title",
						ogDescription: "Desc",
						ogImage: "not an object",
					},
				};
				const result = mapMetaData(raw, TEST_API_URL);

				expect(result.openGraph.ogImage).toBeDefined();
				expect(result.openGraph.ogImage.src).toBeDefined();
			});

			it("returns fallback image when ogImage is null", () => {
				const raw = {
					metaTitle: "Title",
					metaDescription: "Description",
					openGraph: {
						ogTitle: "Title",
						ogDescription: "Desc",
						ogImage: null,
					},
				};
				const result = mapMetaData(raw, TEST_API_URL);

				expect(result.openGraph.ogImage).toBeDefined();
			});

			it("returns fallback image when mapCmsImage returns null", () => {
				mockMapCmsImage.mockReturnValue(null);
				const raw = {
					metaTitle: "Title",
					metaDescription: "Description",
					openGraph: {
						ogTitle: "Title",
						ogDescription: "Desc",
						ogImage: createMockCmsImageResponse(),
					},
				};
				const result = mapMetaData(raw, TEST_API_URL);

				expect(result.openGraph.ogImage).toBeDefined();
			});
		});
	});

	describe("edge cases", () => {
		it("returns empty string for empty string input (normalizeRequiredString trims it)", () => {
			const raw = {
				metaTitle: "",
				metaDescription: "",
			};
			const result = mapMetaData(raw, TEST_API_URL);

			// Empty string is a valid string, gets trimmed to empty
			expect(result.metaTitle).toBe("");
		});

		it("handles whitespace-only strings", () => {
			const raw = {
				metaTitle: "   ",
				metaDescription: "   ",
			};
			const result = mapMetaData(raw, TEST_API_URL);

			expect(result.metaTitle).toBe("");
		});

		it("handles special characters in meta fields", () => {
			const raw = {
				metaTitle: "Title with <special> & 'characters'",
				metaDescription: 'Description with "quotes"',
			};
			const result = mapMetaData(raw, TEST_API_URL);

			expect(result.metaTitle).toBe("Title with <special> & 'characters'");
			expect(result.metaDescription).toBe('Description with "quotes"');
		});

		it("handles unicode in meta fields", () => {
			const raw = {
				metaTitle: "日本語タイトル",
				metaDescription: "Description with emoji 🎉",
			};
			const result = mapMetaData(raw, TEST_API_URL);

			expect(result.metaTitle).toBe("日本語タイトル");
			expect(result.metaDescription).toBe("Description with emoji 🎉");
		});
	});
});
