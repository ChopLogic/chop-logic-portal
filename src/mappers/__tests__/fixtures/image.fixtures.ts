/**
 * Test fixtures for Strapi CMS image responses
 */

import type { CmsImageFormatName } from "@models";

export interface MockImageFormatVariant {
	url: string;
	width: number;
	height: number;
	mime?: string;
}

export interface MockImageFormats {
	thumbnail?: MockImageFormatVariant;
	small?: MockImageFormatVariant;
	medium?: MockImageFormatVariant;
	large?: MockImageFormatVariant;
}

export interface MockCmsImageResponse {
	documentId: string;
	name: string;
	alternativeText?: string | null;
	caption?: string | null;
	width: number;
	height: number;
	url: string;
	formats?: MockImageFormats | null;
}

/**
 * Creates a mock image format variant
 */
export function createMockFormatVariant(
	overrides: Partial<MockImageFormatVariant> = {},
): MockImageFormatVariant {
	return {
		url: "/uploads/test_image_thumbnail.jpg",
		width: 245,
		height: 138,
		mime: "image/jpeg",
		...overrides,
	};
}

/**
 * Creates mock image formats with all standard Strapi sizes
 */
export function createMockImageFormats(
	overrides: Partial<
		Record<CmsImageFormatName, Partial<MockImageFormatVariant> | null>
	> = {},
): MockImageFormats {
	const formats: MockImageFormats = {};

	if (overrides.thumbnail !== null) {
		formats.thumbnail = createMockFormatVariant({
			url: "/uploads/test_image_thumbnail.jpg",
			width: 245,
			height: 138,
			...overrides.thumbnail,
		});
	}

	if (overrides.small !== null) {
		formats.small = createMockFormatVariant({
			url: "/uploads/test_image_small.jpg",
			width: 500,
			height: 281,
			...overrides.small,
		});
	}

	if (overrides.medium !== null) {
		formats.medium = createMockFormatVariant({
			url: "/uploads/test_image_medium.jpg",
			width: 750,
			height: 422,
			...overrides.medium,
		});
	}

	if (overrides.large !== null) {
		formats.large = createMockFormatVariant({
			url: "/uploads/test_image_large.jpg",
			width: 1000,
			height: 563,
			...overrides.large,
		});
	}

	return formats;
}

/**
 * Creates a complete mock CMS image response matching Strapi GraphQL structure
 */
export function createMockCmsImageResponse(
	overrides: Partial<MockCmsImageResponse> = {},
): MockCmsImageResponse {
	return {
		documentId: "img-doc-123",
		name: "test-image.jpg",
		alternativeText: "Test image description",
		caption: "Test image caption",
		width: 1920,
		height: 1080,
		url: "/uploads/test_image_original.jpg",
		formats: createMockImageFormats(),
		...overrides,
	};
}

/**
 * Creates a minimal valid image response (only required fields)
 */
export function createMinimalImageResponse(
	overrides: Partial<MockCmsImageResponse> = {},
): MockCmsImageResponse {
	return {
		documentId: "img-minimal-123",
		name: "minimal-image.jpg",
		width: 800,
		height: 600,
		url: "/uploads/minimal_image.jpg",
		...overrides,
	};
}

/**
 * Creates an image response with absolute URLs (simulating external storage)
 */
export function createAbsoluteUrlImageResponse(
	baseUrl = "https://cdn.example.com",
): MockCmsImageResponse {
	return {
		documentId: "img-absolute-123",
		name: "cdn-image.jpg",
		alternativeText: "CDN hosted image",
		width: 1200,
		height: 800,
		url: `${baseUrl}/uploads/cdn_image.jpg`,
		formats: {
			thumbnail: createMockFormatVariant({
				url: `${baseUrl}/uploads/cdn_image_thumbnail.jpg`,
				width: 245,
				height: 163,
			}),
			small: createMockFormatVariant({
				url: `${baseUrl}/uploads/cdn_image_small.jpg`,
				width: 500,
				height: 333,
			}),
		},
	};
}
