import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { beforeAll, describe, expect, it } from "vitest";
import {
	type DynamicZoneComponent,
	DynamicZoneComponentType,
	type DynamicZoneContent,
	type DynamicZoneParagraph,
} from "../../../lib/content/models/dynamic-zone";
import {
	type Link,
	LinkTarget,
	LinkType,
	ReferrerPolicy,
} from "../../../lib/content/models/link";
import {
	type RichTextContent,
	RichTextContentType,
} from "../../../lib/content/models/rich-text-block";
import ZoneContent from "../ZoneContent.astro";

function sampleRichText(): RichTextContent {
	return [
		{
			type: RichTextContentType.Paragraph,
			children: [{ type: RichTextContentType.Text, text: "Paragraph body" }],
		},
	];
}

function testLink(overrides: Partial<Link> = {}): Link {
	return {
		id: "link-1",
		url: "https://youtu.be/ZXnEJJu3IHQ",
		text: "Watch video",
		target: LinkTarget.Blank,
		type: LinkType.External,
		referrerpolicy: ReferrerPolicy.StrictOriginWhenCrossOrigin,
		...overrides,
	};
}

function paragraphBlock(
	overrides: Partial<DynamicZoneParagraph> = {},
): DynamicZoneParagraph {
	return {
		type: DynamicZoneComponentType.Paragraph,
		id: "para-1",
		heading: "Paragraph section",
		content: sampleRichText(),
		alignment: "left",
		...overrides,
	};
}

describe("ZoneContent.astro", () => {
	let container: Awaited<ReturnType<typeof AstroContainer.create>>;

	beforeAll(async () => {
		container = await AstroContainer.create();
	});

	async function render(content: DynamicZoneContent) {
		return container.renderToString(ZoneContent, {
			props: { content },
		});
	}

	it("wraps output in a zone-content container", async () => {
		const html = await render([]);
		expect(html).toContain('class="zone-content"');
		expect(html).toMatch(/<div[^>]*class="zone-content"/);
	});

	it("renders paragraph blocks", async () => {
		const html = await render([paragraphBlock()]);
		expect(html).toContain("zone-paragraph");
		expect(html).toContain("Paragraph section");
		expect(html).toContain("Paragraph body");
	});

	it("renders each supported zone component type", async () => {
		const content: DynamicZoneContent = [
			paragraphBlock({ id: "p1", heading: "P" }),
			{
				type: DynamicZoneComponentType.CallToAction,
				id: "cta-1",
				heading: "CTA",
				link: testLink({ text: "Go" }),
			},
			{
				type: DynamicZoneComponentType.Gallery,
				id: "gal-1",
				heading: "Gallery",
				layout: "grid",
				items: [],
			},
			{
				type: DynamicZoneComponentType.EmbeddedVideo,
				id: "vid-1",
				heading: "Video",
				link: testLink(),
			},
			{
				type: DynamicZoneComponentType.ReferenceList,
				id: "refs-1",
				heading: "Refs",
				links: [testLink({ id: "r1", text: "Ref 1" })],
			},
			{
				type: DynamicZoneComponentType.Picture,
				id: "pic-1",
				publicationDate: new Date("2026-03-04"),
				item: {
					documentId: "img-1",
					name: "photo.jpg",
					url: "https://cms.example.com/photo.jpg",
					width: 800,
					height: 600,
					formats: {},
				},
			},
		];

		const html = await render(content);
		expect(html).toContain("zone-paragraph");
		expect(html).toContain("zone-cta");
		expect(html).toContain("zone-gallery");
		expect(html).toContain("zone-embedded-video");
		expect(html).toContain("zone-references");
		expect(html).toContain("picture");
	});

	it("renders mixed blocks in source order", async () => {
		const html = await render([
			paragraphBlock({ id: "first", heading: "First" }),
			{
				type: DynamicZoneComponentType.ReferenceList,
				id: "second",
				heading: "Second",
				links: [],
			},
			paragraphBlock({ id: "third", heading: "Third" }),
		]);

		const iFirst = html.indexOf("First");
		const iSecond = html.indexOf("Second");
		const iThird = html.indexOf("Third");
		expect(iFirst).toBeGreaterThanOrEqual(0);
		expect(iSecond).toBeGreaterThan(iFirst);
		expect(iThird).toBeGreaterThan(iSecond);
	});

	it("skips unsupported component types", async () => {
		const html = await render([
			paragraphBlock({ heading: "Visible" }),
			{
				type: "unknown-type",
				id: "x",
			} as unknown as DynamicZoneComponent,
		]);
		expect(html).toContain("Visible");
		expect(html).not.toContain('id="x"');
	});
});
