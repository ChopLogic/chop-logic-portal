import { describe, expect, it } from "vitest";
import type { CmsImage } from "../../models";
import {
	mapCmsImage,
	pickOpenGraphCmsImage,
	resolveMediaAbsoluteUrl,
} from "../image";

function minimalCmsImageRaw(overrides: Record<string, unknown> = {}) {
	return {
		documentId: "doc-1",
		name: "photo.jpg",
		url: "/uploads/photo.jpg",
		width: 800,
		height: 600,
		...overrides,
	};
}

describe("mapCmsImage", () => {
	const baseUrl = "https://cms.example.com";

	it("returns null when input is not a plain object", () => {
		expect(mapCmsImage(null, baseUrl)).toBeNull();
		expect(mapCmsImage(undefined, baseUrl)).toBeNull();
		expect(mapCmsImage([], baseUrl)).toBeNull();
		expect(mapCmsImage("x", baseUrl)).toBeNull();
	});

	it("maps a complete Strapi-style record", () => {
		const raw = minimalCmsImageRaw({
			alternativeText: "  Alt  ",
			caption: "  Cap  ",
			formats: {
				large: {
					url: "/uploads/large.jpg",
					width: "1000",
					height: "630",
					mime: "  image/jpeg  ",
				},
				unknownPreset: {
					url: "/ignore.jpg",
					width: 1,
					height: 1,
				},
			},
		});

		expect(mapCmsImage(raw, baseUrl)).toEqual({
			documentId: "doc-1",
			name: "photo.jpg",
			url: "https://cms.example.com/uploads/photo.jpg",
			width: 800,
			height: 600,
			alternativeText: "Alt",
			caption: "Cap",
			formats: {
				large: {
					url: "https://cms.example.com/uploads/large.jpg",
					width: 1000,
					height: 630,
					mime: "image/jpeg",
				},
			},
		});
	});

	it("uses empty formats when formats is missing or not an object", () => {
		expect(mapCmsImage(minimalCmsImageRaw(), baseUrl)?.formats).toEqual({});
		expect(
			mapCmsImage(minimalCmsImageRaw({ formats: null }), baseUrl)?.formats,
		).toEqual({});
		expect(
			mapCmsImage(minimalCmsImageRaw({ formats: [] }), baseUrl)?.formats,
		).toEqual({});
	});

	it("skips format entries that are not objects", () => {
		const result = mapCmsImage(
			minimalCmsImageRaw({
				formats: {
					large: "broken",
					medium: {
						url: "https://cms.example.com/m.jpg",
						width: 400,
						height: 300,
					},
				},
			}),
			baseUrl,
		);
		expect(result?.formats).toEqual({
			medium: {
				url: "https://cms.example.com/m.jpg",
				width: 400,
				height: 300,
				mime: undefined,
			},
		});
	});

	it("omits optional alternativeText and caption when absent or empty", () => {
		const stripped = mapCmsImage(minimalCmsImageRaw(), baseUrl);
		expect(stripped?.alternativeText).toBeUndefined();
		expect(stripped?.caption).toBeUndefined();

		const emptyOptional = mapCmsImage(
			minimalCmsImageRaw({
				alternativeText: "",
				caption: null,
			}),
			baseUrl,
		);
		expect(emptyOptional?.alternativeText).toBeUndefined();
		expect(emptyOptional?.caption).toBeUndefined();
	});

	it("returns null when documentId, name, or url is missing or empty", () => {
		expect(
			mapCmsImage(minimalCmsImageRaw({ documentId: null }), baseUrl),
		).toBeNull();
		expect(
			mapCmsImage(minimalCmsImageRaw({ url: undefined }), baseUrl),
		).toBeNull();
		expect(mapCmsImage(minimalCmsImageRaw({ name: "" }), baseUrl)).toBeNull();
		expect(mapCmsImage(minimalCmsImageRaw({ url: "" }), baseUrl)).toBeNull();
	});

	it.each([
		["name", { name: 1 }],
		["width", { width: "x" }],
		["height", { height: Number.NaN }],
	] as const)("throws when %s is invalid", (_field, overrides) => {
		expect(() => mapCmsImage(minimalCmsImageRaw(overrides), baseUrl)).toThrow();
	});

	it("defaults non-numeric format width and height to 0", () => {
		const result = mapCmsImage(
			minimalCmsImageRaw({
				formats: {
					small: { url: "/s.jpg", width: "nope", height: "bad" },
				},
			}),
			baseUrl,
		);
		expect(result?.formats.small).toEqual({
			url: "https://cms.example.com/s.jpg",
			width: 0,
			height: 0,
			mime: undefined,
		});
	});
});

describe("resolveMediaAbsoluteUrl", () => {
	it("returns http(s) URLs unchanged", () => {
		expect(
			resolveMediaAbsoluteUrl(
				"https://cdn.example.com/a.jpg",
				"https://cms.example.com",
			),
		).toBe("https://cdn.example.com/a.jpg");
		expect(
			resolveMediaAbsoluteUrl(
				"http://legacy.example.com/a.jpg",
				"https://cms.example.com",
			),
		).toBe("http://legacy.example.com/a.jpg");
	});

	it("resolves relative paths against the base origin", () => {
		expect(
			resolveMediaAbsoluteUrl("/uploads/x.jpg", "https://cms.example.com"),
		).toBe("https://cms.example.com/uploads/x.jpg");
		expect(
			resolveMediaAbsoluteUrl("/uploads/x.jpg", "https://cms.example.com/"),
		).toBe("https://cms.example.com/uploads/x.jpg");
		expect(
			resolveMediaAbsoluteUrl("files/x.jpg", "https://cms.example.com/api/"),
		).toBe("https://cms.example.com/api/files/x.jpg");
	});
});

describe("pickOpenGraphCmsImage", () => {
	const baseImage = (): CmsImage => ({
		documentId: "d1",
		name: "hero.jpg",
		url: "/uploads/original.jpg",
		width: 3840,
		height: 2160,
		alternativeText: undefined,
		caption: undefined,
		formats: {},
	});

	it("prefers large preset over full-size original when both meet OG minimums", () => {
		const image: CmsImage = {
			...baseImage(),
			formats: {
				large: {
					url: "/uploads/large.jpg",
					width: 1000,
					height: 563,
				},
			},
		};
		const pick = pickOpenGraphCmsImage(image, "https://cms.example.com");
		expect(pick.src).toContain("/uploads/large.jpg");
		expect(pick.width).toBe(1000);
		expect(pick.height).toBe(563);
	});

	it("chooses medium over original when large is missing", () => {
		const image: CmsImage = {
			...baseImage(),
			width: 3000,
			height: 2000,
			formats: {
				medium: {
					url: "/uploads/medium.jpg",
					width: 750,
					height: 500,
				},
			},
		};
		const pick = pickOpenGraphCmsImage(image, "https://cms.example.com");
		expect(pick.src).toContain("/uploads/medium.jpg");
		expect(pick.width).toBe(750);
	});

	it("falls back to original when presets are below OG minimum dimensions", () => {
		const image: CmsImage = {
			...baseImage(),
			width: 800,
			height: 600,
			formats: {
				thumbnail: {
					url: "/uploads/thumb.jpg",
					width: 156,
					height: 156,
				},
			},
		};
		const pick = pickOpenGraphCmsImage(image, "https://cms.example.com");
		expect(pick.src).toContain("/uploads/original.jpg");
		expect(pick.width).toBe(800);
	});

	it("picks variant closest to 1200px width among qualifying presets", () => {
		const image: CmsImage = {
			...baseImage(),
			formats: {
				small: { url: "/s.jpg", width: 500, height: 400 },
				medium: { url: "/m.jpg", width: 750, height: 500 },
				large: { url: "/l.jpg", width: 1000, height: 630 },
			},
		};
		const pick = pickOpenGraphCmsImage(image, "https://cms.example.com");
		expect(pick.src).toContain("/l.jpg");
	});

	it("falls back to default src with image dimensions when no candidate has positive size", () => {
		const image: CmsImage = {
			...baseImage(),
			width: 0,
			height: 0,
			formats: {
				large: { url: "/l.jpg", width: 0, height: 0 },
			},
		};
		const pick = pickOpenGraphCmsImage(image, "https://cms.example.com");
		expect(pick.src).toBe("https://cms.example.com/uploads/original.jpg");
		expect(pick.width).toBe(0);
		expect(pick.height).toBe(0);
	});
});
