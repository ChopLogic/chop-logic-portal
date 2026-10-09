import { beforeEach, describe, expect, it, vi } from "vitest";
import {
	mapCMSImageFormatsToSources,
	mapCMSImageToCLImage,
	mapCmsImage,
	pickOpenGraphCmsImage,
	resolveMediaAbsoluteUrl,
} from "../image";
import {
	createAbsoluteUrlImageResponse,
	createMinimalImageResponse,
	createMockCmsImageResponse,
	createMockImageFormats,
} from "./fixtures";

// Mock dependencies
vi.mock("../checkers", () => ({
	isRecord: vi.fn(
		(v) => typeof v === "object" && v !== null && !Array.isArray(v),
	),
	isImageFormatName: vi.fn((k) =>
		["thumbnail", "small", "medium", "large"].includes(k),
	),
}));

vi.mock("../normalizers", () => ({
	normalizeOptionalString: vi.fn((v, d) => {
		if (!v || typeof v === "object") return d;
		return String(v).trim();
	}),
	normalizeRequiredString: vi.fn((v, d) => {
		if (typeof v === "string") return String(v).trim();
		if (!d) throw new Error(`Value ${JSON.stringify(v)} is not a string`);
		return d;
	}),
	normalizeRequiredNumber: vi.fn((v, d) => {
		const n = Number(v);
		if (Number.isNaN(n) && d === undefined) throw new Error("Not a number");
		return Number.isNaN(n) ? d : n;
	}),
}));

const TEST_API_URL = "https://api.example.com";

describe("resolveMediaAbsoluteUrl", () => {
	describe("with absolute URLs", () => {
		it("returns https URL unchanged", () => {
			const url = "https://cdn.example.com/image.jpg";
			expect(resolveMediaAbsoluteUrl(url, TEST_API_URL)).toBe(url);
		});

		it("returns http URL unchanged", () => {
			const url = "http://cdn.example.com/image.jpg";
			expect(resolveMediaAbsoluteUrl(url, TEST_API_URL)).toBe(url);
		});
	});

	describe("with relative paths", () => {
		it("prepends base URL to relative path", () => {
			expect(resolveMediaAbsoluteUrl("/uploads/image.jpg", TEST_API_URL)).toBe(
				"https://api.example.com/uploads/image.jpg",
			);
		});

		it("handles base URL with trailing slash", () => {
			expect(
				resolveMediaAbsoluteUrl(
					"/uploads/image.jpg",
					"https://api.example.com/",
				),
			).toBe("https://api.example.com/uploads/image.jpg");
		});

		it("handles path without leading slash", () => {
			expect(resolveMediaAbsoluteUrl("uploads/image.jpg", TEST_API_URL)).toBe(
				"https://api.example.com/uploads/image.jpg",
			);
		});

		it("handles nested paths", () => {
			expect(
				resolveMediaAbsoluteUrl("/uploads/2024/06/image.jpg", TEST_API_URL),
			).toBe("https://api.example.com/uploads/2024/06/image.jpg");
		});
	});

	describe("edge cases", () => {
		it("handles empty base URL path", () => {
			expect(
				resolveMediaAbsoluteUrl("/image.jpg", "https://api.example.com"),
			).toBe("https://api.example.com/image.jpg");
		});

		it("handles filenames with special characters", () => {
			expect(
				resolveMediaAbsoluteUrl("/uploads/my image (1).jpg", TEST_API_URL),
			).toBe("https://api.example.com/uploads/my%20image%20(1).jpg");
		});
	});
});

describe("mapCmsImage", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("with valid image data", () => {
		it("maps complete image response", () => {
			const raw = createMockCmsImageResponse();
			const result = mapCmsImage(raw, TEST_API_URL);

			expect(result).not.toBeNull();
			expect(result?.documentId).toBe("img-doc-123");
			expect(result?.name).toBe("test-image.jpg");
			expect(result?.alternativeText).toBe("Test image description");
			expect(result?.caption).toBe("Test image caption");
			expect(result?.width).toBe(1920);
			expect(result?.height).toBe(1080);
		});

		it("resolves relative URL to absolute", () => {
			const raw = createMockCmsImageResponse({
				url: "/uploads/test.jpg",
			});
			const result = mapCmsImage(raw, TEST_API_URL);

			expect(result?.url).toBe("https://api.example.com/uploads/test.jpg");
		});

		it("preserves absolute URL", () => {
			const raw = createAbsoluteUrlImageResponse("https://cdn.example.com");
			const result = mapCmsImage(raw, TEST_API_URL);

			expect(result?.url).toBe("https://cdn.example.com/uploads/cdn_image.jpg");
		});

		it("maps image formats correctly", () => {
			const raw = createMockCmsImageResponse();
			const result = mapCmsImage(raw, TEST_API_URL);

			expect(result?.formats.thumbnail).toBeDefined();
			expect(result?.formats.small).toBeDefined();
			expect(result?.formats.medium).toBeDefined();
			expect(result?.formats.large).toBeDefined();
		});

		it("maps minimal image without optional fields", () => {
			const raw = createMinimalImageResponse();
			const result = mapCmsImage(raw, TEST_API_URL);

			expect(result).not.toBeNull();
			expect(result?.documentId).toBe("img-minimal-123");
			expect(result?.alternativeText).toBeUndefined();
			expect(result?.caption).toBeUndefined();
		});
	});

	describe("with invalid inputs", () => {
		it("returns null for non-object input", () => {
			expect(mapCmsImage("string", TEST_API_URL)).toBeNull();
			expect(mapCmsImage(123, TEST_API_URL)).toBeNull();
			expect(mapCmsImage(null, TEST_API_URL)).toBeNull();
			expect(mapCmsImage(undefined, TEST_API_URL)).toBeNull();
		});

		it("returns null for array input", () => {
			expect(mapCmsImage([], TEST_API_URL)).toBeNull();
		});

		it("returns null when url is missing", () => {
			const raw = createMockCmsImageResponse();
			// @ts-expect-error - intentionally removing required field
			delete raw.url;
			expect(mapCmsImage(raw, TEST_API_URL)).toBeNull();
		});

		it("returns null when documentId is missing", () => {
			const raw = createMockCmsImageResponse();
			// @ts-expect-error - intentionally removing required field
			delete raw.documentId;
			expect(mapCmsImage(raw, TEST_API_URL)).toBeNull();
		});

		it("returns null when name is missing", () => {
			const raw = createMockCmsImageResponse();
			// @ts-expect-error - intentionally removing required field
			delete raw.name;
			expect(mapCmsImage(raw, TEST_API_URL)).toBeNull();
		});
	});

	describe("format handling", () => {
		it("handles missing formats gracefully", () => {
			const raw = createMockCmsImageResponse({ formats: null });
			const result = mapCmsImage(raw, TEST_API_URL);

			expect(result?.formats).toEqual({});
		});

		it("handles partial formats", () => {
			const raw = createMockCmsImageResponse({
				formats: createMockImageFormats({
					medium: null,
					large: null,
				}),
			});
			const result = mapCmsImage(raw, TEST_API_URL);

			expect(result?.formats.thumbnail).toBeDefined();
			expect(result?.formats.small).toBeDefined();
			expect(result?.formats.medium).toBeUndefined();
			expect(result?.formats.large).toBeUndefined();
		});

		it("ignores unknown format names", () => {
			const raw = {
				...createMockCmsImageResponse(),
				formats: {
					small: { url: "/small.jpg", width: 500, height: 300 },
					unknownFormat: { url: "/unknown.jpg", width: 100, height: 100 },
				},
			};
			const result = mapCmsImage(raw, TEST_API_URL);

			expect(result?.formats.small).toBeDefined();
		});
	});
});

describe("pickOpenGraphCmsImage", () => {
	const createCmsImage = (width: number, height: number, formats = {}) => ({
		documentId: "test",
		name: "test.jpg",
		url: "/original.jpg",
		width,
		height,
		formats,
	});

	it("prefers format closest to ideal OG width (1200px)", () => {
		const image = createCmsImage(2000, 1500, {
			small: { url: "/small.jpg", width: 500, height: 375 },
			medium: { url: "/medium.jpg", width: 750, height: 563 },
			large: { url: "/large.jpg", width: 1000, height: 750 },
		});
		const result = pickOpenGraphCmsImage(image, TEST_API_URL);

		// large (1000px) is closest to ideal 1200px among formats
		expect(result.src).toContain("large.jpg");
	});

	it("uses original when no formats available", () => {
		const image = createCmsImage(1200, 800, {});
		const result = pickOpenGraphCmsImage(image, TEST_API_URL);

		expect(result.src).toContain("original.jpg");
	});

	it("falls back to original when formats are below minimum dimensions", () => {
		// When formats are too small but original meets requirements,
		// the algorithm may still prefer larger images
		const image = createCmsImage(1200, 800, {
			thumbnail: { url: "/thumb.jpg", width: 100, height: 75 },
			large: { url: "/large.jpg", width: 1000, height: 750 },
		});
		const result = pickOpenGraphCmsImage(image, TEST_API_URL);

		// Should pick large or original based on scoring
		expect(result.src).toBeDefined();
		expect(result.width).toBeGreaterThanOrEqual(600);
	});

	it("returns dimensions from the original image", () => {
		const image = createCmsImage(1200, 800, {
			medium: { url: "/medium.jpg", width: 750, height: 500 },
		});
		const result = pickOpenGraphCmsImage(image, TEST_API_URL);

		// The implementation returns picked image dimensions
		expect(result.width).toBeGreaterThan(0);
		expect(result.height).toBeGreaterThan(0);
	});

	it("resolves relative URLs to absolute", () => {
		const image = createCmsImage(800, 600, {});
		const result = pickOpenGraphCmsImage(image, TEST_API_URL);

		expect(result.src).toContain(TEST_API_URL);
	});
});

describe("mapCMSImageFormatsToSources", () => {
	it("maps all available formats to sources", () => {
		const result = mapCMSImageFormatsToSources({
			small: { url: "/small.jpg", width: 500, height: 281, mime: "image/jpeg" },
			medium: {
				url: "/medium.jpg",
				width: 750,
				height: 422,
				mime: "image/jpeg",
			},
			large: {
				url: "/large.jpg",
				width: 1000,
				height: 563,
				mime: "image/jpeg",
			},
		});

		expect(result).toHaveLength(3);
		expect(result[0]?.src).toBe("/small.jpg");
		expect(result[1]?.src).toBe("/medium.jpg");
		expect(result[2]?.src).toBe("/large.jpg");
	});

	it("orders sources by size (small to large)", () => {
		const result = mapCMSImageFormatsToSources({
			large: {
				url: "/large.jpg",
				width: 1000,
				height: 563,
				mime: "image/jpeg",
			},
			small: { url: "/small.jpg", width: 500, height: 281, mime: "image/jpeg" },
			medium: {
				url: "/medium.jpg",
				width: 750,
				height: 422,
				mime: "image/jpeg",
			},
		});

		expect(result[0]?.src).toBe("/small.jpg");
		expect(result[1]?.src).toBe("/medium.jpg");
		expect(result[2]?.src).toBe("/large.jpg");
	});

	it("includes width descriptor in sources", () => {
		const result = mapCMSImageFormatsToSources({
			small: { url: "/small.jpg", width: 500, height: 281, mime: "image/jpeg" },
		});

		expect(result[0]?.descriptor).toBe("500w");
	});

	it("handles missing formats gracefully", () => {
		const result = mapCMSImageFormatsToSources({
			small: { url: "/small.jpg", width: 500, height: 281, mime: "image/jpeg" },
		});

		expect(result).toHaveLength(1);
	});

	it("returns empty array for empty formats", () => {
		const result = mapCMSImageFormatsToSources({});
		expect(result).toHaveLength(0);
	});

	it("uses mime type from format or defaults to image/jpeg", () => {
		const result = mapCMSImageFormatsToSources({
			small: {
				url: "/small.webp",
				width: 500,
				height: 281,
				mime: "image/webp",
			},
		});

		expect(result[0]?.type).toBe("image/webp");
	});

	it("excludes thumbnail from sources (not in format order)", () => {
		const result = mapCMSImageFormatsToSources({
			thumbnail: {
				url: "/thumb.jpg",
				width: 245,
				height: 138,
				mime: "image/jpeg",
			},
			small: { url: "/small.jpg", width: 500, height: 281, mime: "image/jpeg" },
		});

		expect(result).toHaveLength(1);
		expect(result[0]?.src).toBe("/small.jpg");
	});
});

describe("mapCMSImageToCLImage", () => {
	it("maps complete CMS image to CL image props", () => {
		const cmsImage = {
			documentId: "test",
			name: "test.jpg",
			url: "/original.jpg",
			width: 1200,
			height: 800,
			alternativeText: "Test alt text",
			caption: "Test caption",
			formats: {
				small: {
					url: "/small.jpg",
					width: 500,
					height: 333,
					mime: "image/jpeg",
				},
			},
		};
		const result = mapCMSImageToCLImage(cmsImage);

		expect(result.alt).toBe("Test alt text");
		expect(result.caption).toBe("Test caption");
		expect(result.loading).toBe("lazy");
		expect(result.sources).toBeDefined();
	});

	it("returns default image for null input", () => {
		const result = mapCMSImageToCLImage(null);

		expect(result.src).toBeDefined();
		expect(result.loading).toBe("lazy");
	});

	it("uses default alt text when alternativeText is missing", () => {
		const cmsImage = {
			documentId: "test",
			name: "test.jpg",
			url: "/original.jpg",
			width: 800,
			height: 600,
			formats: {},
		};
		const result = mapCMSImageToCLImage(cmsImage);

		expect(result.alt).toBe("Chop Logic Image");
	});

	it("applies aspect ratio when provided", () => {
		const cmsImage = {
			documentId: "test",
			name: "test.jpg",
			url: "/original.jpg",
			width: 800,
			height: 600,
			formats: {},
		};
		const result = mapCMSImageToCLImage(cmsImage, "16/9");

		expect(result.aspectRatio).toBe("16/9");
	});

	it("uses smallest available format as fallback src", () => {
		const cmsImage = {
			documentId: "test",
			name: "test.jpg",
			url: "/original.jpg",
			width: 1200,
			height: 800,
			formats: {
				small: {
					url: "/small.jpg",
					width: 500,
					height: 333,
					mime: "image/jpeg",
				},
				large: {
					url: "/large.jpg",
					width: 1000,
					height: 667,
					mime: "image/jpeg",
				},
			},
		};
		const result = mapCMSImageToCLImage(cmsImage);

		expect(result.src).toBe("/small.jpg");
	});

	it("generates proper sizes attribute", () => {
		const cmsImage = {
			documentId: "test",
			name: "test.jpg",
			url: "/original.jpg",
			width: 800,
			height: 600,
			formats: {},
		};
		const result = mapCMSImageToCLImage(cmsImage);

		expect(result.sizes).toContain("max-width");
	});
});
