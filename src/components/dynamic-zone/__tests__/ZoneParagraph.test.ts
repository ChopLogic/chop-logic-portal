import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { beforeAll, describe, expect, it } from "vitest";
import {
	DynamicZoneComponentType,
	type DynamicZoneParagraph,
} from "../../../lib/content/models/dynamic-zone";
import {
	type RichTextContent,
	RichTextContentType,
} from "../../../lib/content/models/rich-text-block";
import ZoneParagraph from "../ZoneParagraph.astro";

function sampleRichText(): RichTextContent {
	return [
		{
			type: RichTextContentType.Paragraph,
			children: [
				{
					type: RichTextContentType.Text,
					text: "Body copy",
				},
			],
		},
	];
}

function testParagraph(
	overrides: Partial<DynamicZoneParagraph> = {},
): DynamicZoneParagraph {
	return {
		type: DynamicZoneComponentType.Paragraph,
		id: "para-1",
		heading: "Main heading",
		content: sampleRichText(),
		alignment: "left",
		...overrides,
	};
}

describe("ZoneParagraph.astro", () => {
	let container: Awaited<ReturnType<typeof AstroContainer.create>>;

	beforeAll(async () => {
		container = await AstroContainer.create();
	});

	async function render(paragraph: DynamicZoneParagraph) {
		return container.renderToString(ZoneParagraph, {
			props: { paragraph },
		});
	}

	it("renders a section with heading as h2 and rich text body", async () => {
		const html = await render(testParagraph());
		expect(html).toContain('<section class="zone-paragraph"');
		expect(html).toContain("</section>");
		expect(html).toContain("<h2");
		expect(html).toContain("Main heading");
		expect(html).toContain("</h2>");
		expect(html).toContain("Body copy");
	});

	it("renders subHeading as h3 when provided", async () => {
		const html = await render(
			testParagraph({ subHeading: "Secondary heading" }),
		);
		expect(html).toContain("<h3");
		expect(html).toContain("Secondary heading");
		expect(html).toContain("</h3>");
		const iH2 = html.indexOf("</h2>");
		const iH3 = html.indexOf("<h3");
		expect(iH3).toBeGreaterThan(iH2);
	});

	it("omits h3 when subHeading is not set", async () => {
		const html = await render(testParagraph());
		expect(html).not.toContain("<h3");
	});

	it("applies text alignment from paragraph props", async () => {
		const html = await render(testParagraph({ alignment: "center" }));
		expect(html).toContain('style="text-align: center"');
	});

	it("escapes dangerous characters in headings", async () => {
		const html = await render(
			testParagraph({
				heading: "<script>",
				subHeading: "<img onerror>",
			}),
		);
		expect(html).toContain("&lt;script&gt;");
		expect(html).toContain("&lt;img onerror&gt;");
		expect(html).not.toContain("<script>");
	});
});
