import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
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
	mapEmbeddedVideo,
	mapPicture,
	mapReferenceList,
	mapZoneCallToAction,
	mapZoneParagraph,
} from "../dynamic-zone";

const __dirname = dirname(fileURLToPath(import.meta.url));
const mocksDir = join(__dirname, "../../../strapi/__mocks__");
const baseUrl = "https://cms.example.com";

function loadMockContent(filename: string, pageKey: string): unknown[] {
	const raw = JSON.parse(
		readFileSync(join(mocksDir, filename), "utf8"),
	) as Record<string, unknown>;
	const data = raw["data"] as Record<string, unknown>;
	const page = data[pageKey] as Record<string, unknown>;
	return page["content"] as unknown[];
}

describe("dynamic zone mappers", () => {
	beforeEach(() => {
		vi.stubEnv("STRAPI_URL", baseUrl);
	});

	afterEach(() => {
		vi.unstubAllEnvs();
	});

	describe("mapZoneParagraph", () => {
		it("maps paragraph blocks from the home page mock", () => {
			const [block] = loadMockContent(
				"fetch-home-page-response.json",
				"home",
			) as Record<string, unknown>[];

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
			const [block] = loadMockContent(
				"fetch-blog-page-response.json",
				"blog",
			) as Record<string, unknown>[];

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
			const blocks = loadMockContent(
				"fetch-home-page-response.json",
				"home",
			) as Record<string, unknown>[];
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
			const blocks = loadMockContent(
				"fetch-blog-page-response.json",
				"blog",
			) as Record<string, unknown>[];
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
			const blocks = loadMockContent(
				"fetch-home-page-response.json",
				"home",
			) as Record<string, unknown>[];
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
			const raw = JSON.parse(
				readFileSync(
					join(mocksDir, "fetch-all-articles-projection.json"),
					"utf8",
				),
			) as Record<string, unknown>;
			const articles = (raw["data"] as Record<string, unknown>)[
				"articles"
			] as Record<string, unknown>[];
			const content = articles[0]?.["content"] as Record<string, unknown>[];
			const block = content.find((b) => Array.isArray(b["links"]));
			expect(block).toBeDefined();

			const result = mapReferenceList(block) as DynamicZoneReferenceList;

			expect(result.type).toBe(DynamicZoneComponentType.ReferenceList);
			expect(result.heading).toBe("Reference list");
			expect(result.links).toHaveLength(3);
			expect(result.links[0]?.platform).toBe(SocialPlatform.GitHub);
		});
	});

	describe("mapPicture", () => {
		it("maps picture from the home page mock", () => {
			const blocks = loadMockContent(
				"fetch-home-page-response.json",
				"home",
			) as Record<string, unknown>[];
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
			const blocks = loadMockContent(
				"fetch-blog-page-response.json",
				"blog",
			) as Record<string, unknown>[];
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
