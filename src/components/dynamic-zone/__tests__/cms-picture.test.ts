import { describe, expect, it } from "vitest";
import type { CmsImage } from "../../../lib/content/models/image";
import {
	buildCmsPictureAttributes,
	buildCmsPictureSrcset,
	collectCmsPictureVariants,
} from "../cms-picture";

function testCmsImage(overrides: Partial<CmsImage> = {}): CmsImage {
	return {
		documentId: "doc-1",
		name: "photo.jpg",
		url: "https://cms.example.com/uploads/photo.jpg",
		width: 2000,
		height: 1333,
		formats: {},
		...overrides,
	};
}

describe("collectCmsPictureVariants", () => {
	it("includes format presets and original sorted by width", () => {
		const variants = collectCmsPictureVariants(
			testCmsImage({
				formats: {
					thumbnail: {
						url: "https://cms.example.com/uploads/thumb.jpg",
						width: 245,
						height: 163,
					},
					large: {
						url: "https://cms.example.com/uploads/large.jpg",
						width: 1000,
						height: 667,
					},
				},
			}),
		);

		expect(variants.map((v) => v.width)).toEqual([245, 1000, 2000]);
	});

	it("deduplicates entries that share the same width", () => {
		const variants = collectCmsPictureVariants(
			testCmsImage({
				width: 500,
				height: 333,
				url: "https://cms.example.com/uploads/photo.jpg",
				formats: {
					small: {
						url: "https://cms.example.com/uploads/small.jpg",
						width: 500,
						height: 333,
					},
				},
			}),
		);

		expect(variants).toHaveLength(1);
		expect(variants[0]?.url).toBe("https://cms.example.com/uploads/photo.jpg");
	});
});

describe("buildCmsPictureSrcset", () => {
	it("returns undefined for a single variant", () => {
		expect(
			buildCmsPictureSrcset([
				{
					url: "https://cms.example.com/a.jpg",
					width: 800,
					height: 600,
				},
			]),
		).toBeUndefined();
	});

	it("joins variants as width descriptors", () => {
		expect(
			buildCmsPictureSrcset([
				{
					url: "https://cms.example.com/small.jpg",
					width: 500,
					height: 333,
				},
				{
					url: "https://cms.example.com/large.jpg",
					width: 1000,
					height: 667,
				},
			]),
		).toBe(
			"https://cms.example.com/small.jpg 500w, https://cms.example.com/large.jpg 1000w",
		);
	});
});

describe("buildCmsPictureAttributes", () => {
	it("prefers large format as default src when available", () => {
		const attrs = buildCmsPictureAttributes(
			testCmsImage({
				formats: {
					medium: {
						url: "https://cms.example.com/uploads/medium.jpg",
						width: 750,
						height: 500,
					},
					large: {
						url: "https://cms.example.com/uploads/large.jpg",
						width: 1000,
						height: 667,
					},
				},
			}),
		);

		expect(attrs.src).toBe("https://cms.example.com/uploads/large.jpg");
		expect(attrs.width).toBe(1000);
		expect(attrs.height).toBe(667);
	});

	it("builds srcset from all variants and defaults sizes to 100vw", () => {
		const attrs = buildCmsPictureAttributes(
			testCmsImage({
				formats: {
					small: {
						url: "https://cms.example.com/uploads/small.jpg",
						width: 500,
						height: 333,
					},
				},
			}),
		);

		expect(attrs.srcset).toBe(
			"https://cms.example.com/uploads/small.jpg 500w, https://cms.example.com/uploads/photo.jpg 2000w",
		);
		expect(attrs.sizes).toBe("100vw");
	});

	it("omits srcset when only the original is available", () => {
		const attrs = buildCmsPictureAttributes(testCmsImage());
		expect(attrs.src).toBe("https://cms.example.com/uploads/photo.jpg");
		expect(attrs.srcset).toBeUndefined();
	});
});
