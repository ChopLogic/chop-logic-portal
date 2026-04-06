import { describe, expect, it } from "vitest";
import type { CmsImage } from "../models";
import { pickOpenGraphCmsImage } from "./image";

const baseImage = (): CmsImage => ({
	documentId: "d1",
	name: "hero.jpg",
	url: "/uploads/original.jpg",
	width: 3840,
	height: 2160,
	alternativeText: null,
	caption: null,
	formats: {},
});

describe("pickOpenGraphCmsImage", () => {
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
});
