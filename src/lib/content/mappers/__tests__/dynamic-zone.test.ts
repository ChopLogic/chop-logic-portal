import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
	type DynamicZoneCallToAction,
	DynamicZoneComponentType,
	type DynamicZoneEmbeddedVideo,
	type DynamicZonePicture,
	type DynamicZoneReferenceList,
} from "../../models/dynamic-zone";
import {
	LinkTarget,
	LinkType,
	ReferrerPolicy,
	SocialPlatform,
} from "../../models/link";
import { RichTextContentType } from "../../models/rich-text-block";
import {
	mapDynamicZoneContent,
	mapEmbeddedVideo,
	mapGallery,
	mapPicture,
	mapReferenceList,
	mapZoneCallToAction,
	mapZoneParagraph,
} from "../dynamic-zone";

const baseUrl = "https://cms.example.com";

const homeParagraphBlock = {
	id: "29",
	heading: "Paragraph Heading",
	subHeading: "Paragraph Sub Heading",
	content: [
		{
			type: "paragraph",
			children: [
				{
					type: "text",
					text: "Lorem ipsum dolor sit amet.",
				},
			],
		},
	],
	alignment: "left",
};

const homeCallToActionBlock = {
	id: "5",
	heading: "Heading",
	subHeading: "Call to action sub-head",
	link: {
		id: "34",
		text: "Call to action",
		url: "https://github.com/SavouryGin",
		type: "external",
		platform: "GitHub",
		target: "blank",
		referrerpolicy: "strict_origin_when_cross_origin",
	},
	picture: {
		documentId: "q1kzu6b3zlc7qhl9c0x5uwr1",
		name: "logo_cc917a1e2d.png",
		url: "/uploads/logo_cc917a1e2d.png",
		width: 400,
		height: 400,
	},
};

const homeEmbeddedVideoBlock = {
	id: "7",
	heading: "YouTube Video Title",
	subHeading: " 732 bytes of Python just borked every Linux machine on earth… ",
	link: {
		id: "23",
		text: "YouTube Video Title",
		url: "https://youtu.be/lkifbWtxxlk?si=YdxhIBzsR3ROqujA",
		type: "external",
		platform: "YouTube",
		target: "blank",
		referrerpolicy: "strict_origin_when_cross_origin",
	},
};

const homePictureBlock = {
	id: "5",
	publicationDate: "2026-03-04T00:00:00.000Z",
	item: {
		documentId: "gqg6jhtzay1wox6e01g9zcb7",
		name: "home-picture.jpg",
		url: "/uploads/home-picture.jpg",
		width: 1200,
		height: 800,
	},
};

const homePageContent = [
	homeParagraphBlock,
	homeCallToActionBlock,
	homeEmbeddedVideoBlock,
	homePictureBlock,
];

const blogParagraphBlock = {
	id: "32",
	heading: "Blog Paragraph Heading",
	content: [
		{
			type: "heading",
			level: 3,
			children: [
				{
					type: "text",
					text: "Blog heading content",
				},
			],
		},
	],
	alignment: "left",
};

const blogPictureBlock = {
	id: "6",
	publicationDate: "2026-03-30T00:00:00.000Z",
	item: {
		documentId: "blog-picture-doc",
		name: "blog-picture.jpg",
		url: "/uploads/blog-picture.jpg",
		width: 1600,
		height: 900,
	},
};

const blogCallToActionBlock = {
	id: "11",
	heading: "Blog CTA Heading",
	link: {
		id: "35",
		text: "Call To Action",
		url: "https://example.com/cta",
		type: "external",
		platform: "GitHub",
		target: "blank",
		referrerpolicy: "strict_origin_when_cross_origin",
	},
	picture: null,
};

const blogPageContent = [
	blogParagraphBlock,
	blogPictureBlock,
	blogCallToActionBlock,
];

const aboutGalleryBlock = {
	id: "2",
	heading: "Gallery heading",
	subHeading: "Gallery subheading",
	layout: "carousel",
	items: [
		{
			documentId: "gallery-item-1",
			name: "gallery-1.jpg",
			url: "/uploads/gallery-1.jpg",
			width: 800,
			height: 600,
		},
	],
};

const aboutMeContent = [aboutGalleryBlock];

const articlesGalleryBlock = {
	id: "3",
	heading: "Carousel heading",
	subHeading: "Carousel subheading",
	layout: "carousel",
	items: [
		{
			documentId: "article-gallery-item-1",
			name: "article-gallery-1.jpg",
			url: "/uploads/article-gallery-1.jpg",
			width: 640,
			height: 480,
		},
	],
};

const referenceListBlock = {
	id: "4",
	heading: "Reference list",
	links: [
		{
			id: "41",
			text: "GitHub",
			url: "https://github.com",
			type: "external",
			platform: "GitHub",
			target: "blank",
			referrerpolicy: "strict_origin_when_cross_origin",
		},
		{
			id: "42",
			text: "LinkedIn",
			url: "https://linkedin.com",
			type: "external",
			platform: "LinkedIn",
			target: "blank",
			referrerpolicy: "strict_origin_when_cross_origin",
		},
		{
			id: "43",
			text: "Twitter",
			url: "https://twitter.com",
			type: "external",
			platform: "XTwitter",
			target: "blank",
			referrerpolicy: "strict_origin_when_cross_origin",
		},
	],
};

const articlesProjection = {
	articles: [
		{
			content: [articlesGalleryBlock, referenceListBlock],
		},
	],
};

describe("dynamic zone mappers", () => {
	beforeEach(() => {
		vi.stubEnv("STRAPI_URL", baseUrl);
	});

	describe("mapGallery", () => {
		it("maps gallery (carousel) from the about page mock", () => {
			const blocks = aboutMeContent as Record<string, unknown>[];
			const block = blocks.find(
				(b) => Array.isArray(b["items"]) && b["layout"] === "carousel",
			);
			expect(block).toBeDefined();

			const mapped = mapGallery(block);
			expect(mapped.type).toBe(DynamicZoneComponentType.Gallery);
			expect(mapped.id).toBe("2");
			expect(mapped.layout).toBe("carousel");
			expect(Array.isArray(mapped.items)).toBe(true);
		});

		it("maps gallery from the articles projection mock", () => {
			const content = articlesProjection.articles[0]?.content as Record<
				string,
				unknown
			>[];
			const block = content.find(
				(b) => Array.isArray(b["items"]) && b["layout"] === "carousel",
			);
			expect(block).toBeDefined();

			const mapped = mapGallery(block);
			expect(mapped.type).toBe(DynamicZoneComponentType.Gallery);
			expect(mapped.heading).toBe("Carousel heading");
			expect(mapped.items.length).toBeGreaterThan(0);
		});
	});

	afterEach(() => {
		vi.unstubAllEnvs();
	});

	describe("mapZoneParagraph", () => {
		it("maps paragraph blocks from the home page mock", () => {
			const [block] = homePageContent as Record<string, unknown>[];

			const result = mapZoneParagraph(block);

			expect(result.type).toBe(DynamicZoneComponentType.Paragraph);
			expect(result).toMatchObject({
				id: "29",
				heading: "Paragraph Heading",
				subHeading: "Paragraph Sub Heading",
				alignment: "left",
			});
			expect(result.content.length).toBeGreaterThan(0);
			expect(result.content[0]?.type).toBe(RichTextContentType.Paragraph);
		});

		it("maps paragraph blocks from the blog page mock", () => {
			const [block] = blogPageContent as Record<string, unknown>[];

			const result = mapZoneParagraph(block);

			expect(result.type).toBe(DynamicZoneComponentType.Paragraph);
			expect(result.id).toBe("32");
			expect(
				result.content.some(
					(item) => item.type === RichTextContentType.Heading,
				),
			).toBe(true);
		});

		it("throws when input is not a record", () => {
			expect(() => mapZoneParagraph(null)).toThrow(/Expected a record/);
		});
	});

	describe("mapZoneCallToAction", () => {
		it("maps call-to-action with picture from the home page mock", () => {
			const blocks = homePageContent as Record<string, unknown>[];
			const block = blocks.find((b) => b["picture"] != null);
			expect(block).toBeDefined();

			const result = mapZoneCallToAction(block) as DynamicZoneCallToAction;

			expect(result.type).toBe(DynamicZoneComponentType.CallToAction);
			expect(result.id).toBe("5");
			expect(result.heading).toBe("Heading");
			expect(result.link).toEqual({
				id: "34",
				text: "Call to action",
				url: "https://github.com/SavouryGin",
				type: LinkType.External,
				target: LinkTarget.Blank,
				referrerpolicy: ReferrerPolicy.StrictOriginWhenCrossOrigin,
				platform: SocialPlatform.GitHub,
			});
			expect(result.picture?.documentId).toBe("q1kzu6b3zlc7qhl9c0x5uwr1");
			expect(result.picture?.url).toBe(
				`${baseUrl}/uploads/logo_cc917a1e2d.png`,
			);
		});

		it("maps call-to-action without picture when picture is null", () => {
			const blocks = blogPageContent as Record<string, unknown>[];
			const block = blocks.find((b) => b["picture"] === null);
			expect(block).toBeDefined();

			const result = mapZoneCallToAction(block);

			expect(result.type).toBe(DynamicZoneComponentType.CallToAction);
			expect(result.picture).toBeUndefined();
			expect(result.link.text).toBe("Call To Action");
		});
	});

	describe("mapEmbeddedVideo", () => {
		it("maps embedded video from the home page mock", () => {
			const blocks = homePageContent as Record<string, unknown>[];
			const block = blocks.find(
				(b) => b["link"] != null && !("picture" in b) && !("item" in b),
			);
			expect(block).toBeDefined();

			const result = mapEmbeddedVideo(block) as DynamicZoneEmbeddedVideo;

			expect(result.type).toBe(DynamicZoneComponentType.EmbeddedVideo);
			expect(result.id).toBe("7");
			expect(result.link.platform).toBe(SocialPlatform.YouTube);
			expect(result.link.text).toBe("YouTube Video Title");
		});
	});

	describe("mapReferenceList", () => {
		it("maps reference list from the articles projection mock", () => {
			const content = articlesProjection.articles[0]?.content as Record<
				string,
				unknown
			>[];
			const block = content.find((b) => Array.isArray(b["links"]));
			expect(block).toBeDefined();

			const result = mapReferenceList(block) as DynamicZoneReferenceList;

			expect(result.type).toBe(DynamicZoneComponentType.ReferenceList);
			expect(result.heading).toBe("Reference list");
			expect(result.links).toHaveLength(3);
			expect(result.links[0]?.platform).toBe(SocialPlatform.GitHub);
		});
	});

	describe("mapDynamicZoneContent", () => {
		it("maps all supported blocks from the home page mock in order", () => {
			const content = homePageContent;

			const result = mapDynamicZoneContent(content);

			expect(result).toHaveLength(4);
			expect(result.map((block) => block.type)).toEqual([
				DynamicZoneComponentType.Paragraph,
				DynamicZoneComponentType.CallToAction,
				DynamicZoneComponentType.EmbeddedVideo,
				DynamicZoneComponentType.Picture,
			]);
		});

		it("maps supported blocks from the blog page mock", () => {
			const content = blogPageContent;

			const result = mapDynamicZoneContent(content);

			expect(result).toHaveLength(3);
			expect(result.map((block) => block.type)).toEqual([
				DynamicZoneComponentType.Paragraph,
				DynamicZoneComponentType.Picture,
				DynamicZoneComponentType.CallToAction,
			]);
		});

		it("returns an empty array when content is not an array", () => {
			expect(mapDynamicZoneContent(null)).toEqual([]);
			expect(mapDynamicZoneContent(undefined)).toEqual([]);
		});
	});

	describe("mapPicture", () => {
		it("maps picture from the home page mock", () => {
			const blocks = homePageContent as Record<string, unknown>[];
			const block = blocks.find((b) => b["publicationDate"] != null);
			expect(block).toBeDefined();

			const result = mapPicture(block) as DynamicZonePicture;

			expect(result.type).toBe(DynamicZoneComponentType.Picture);
			expect(result.id).toBe("5");
			expect(result.item.documentId).toBe("gqg6jhtzay1wox6e01g9zcb7");
			expect(result.publicationDate).toEqual(
				new Date("2026-03-04T00:00:00.000Z"),
			);
		});

		it("maps picture from the blog page mock", () => {
			const blocks = blogPageContent as Record<string, unknown>[];
			const block = blocks.find((b) => b["item"] != null);
			expect(block).toBeDefined();

			const result = mapPicture(block);

			expect(result.id).toBe("6");
			expect(result.publicationDate).toEqual(
				new Date("2026-03-30T00:00:00.000Z"),
			);
		});
	});
});
