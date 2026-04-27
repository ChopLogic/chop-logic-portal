import { describe, expect, it } from "vitest";
import {
	RichTextContentType,
	RichTextListFormat,
} from "../../models/rich-text-block";
import { mapRichTextBlock } from "../rich-text-block";

/**
 * Copied from `src/lib/strapi/__mocks__/fetch-config-response.json`
 * (`data.config.footer`). Inline string keeps the suite independent of that file at runtime.
 */
const FOOTER_STRAPI_BLOCKS: unknown = JSON.parse(
	`[{"type":"heading","children":[{"type":"text","text":"Heading Text Lvl 1"}],"level":1},{"type":"paragraph","children":[{"type":"text","text":"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."}]},{"type":"paragraph","children":[{"type":"text","text":"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."}]},{"type":"heading","children":[{"type":"text","text":"Heading Text Lvl 2"}],"level":2},{"type":"paragraph","children":[{"type":"text","text":"Regular text 1!"}]},{"type":"paragraph","children":[{"type":"text","text":"Regular text2..."}]},{"type":"heading","children":[{"type":"text","text":"Heading Text Lvl 3"}],"level":3},{"type":"paragraph","children":[{"type":"text","text":"Regular text"}]},{"type":"paragraph","children":[{"type":"text","text":"Bold text","bold":true}]},{"type":"paragraph","children":[{"type":"text","text":"Italic text","italic":true}]},{"type":"paragraph","children":[{"type":"text","text":"Underline text","underline":true}]},{"type":"paragraph","children":[{"type":"text","text":"Strike-through text ","strikethrough":true}]},{"type":"paragraph","children":[{"text":"","type":"text"},{"type":"link","url":"https://www.youtube.com/","children":[{"text":"Link text","type":"text"}],"target":"_blank"},{"text":"","type":"text"}]},{"type":"paragraph","children":[{"type":"text","text":"var test = \\"Inline Code Text\\";","code":true}]},{"type":"list","format":"unordered","children":[{"type":"list-item","children":[{"type":"text","text":"Bulleted list option 1"}]},{"type":"list","format":"unordered","indentLevel":1,"children":[{"type":"list-item","children":[{"type":"text","text":"Sub-option 1"}]},{"type":"list-item","children":[{"type":"text","text":"Sub-option 2"}]}]},{"type":"list-item","children":[{"type":"text","text":"Bulleted list option 2"}]},{"type":"list-item","children":[{"type":"text","text":"Bulleted list option 3"}]}]},{"type":"paragraph","children":[{"type":"text","text":"Regular text"}]},{"type":"list","format":"ordered","children":[{"type":"list-item","children":[{"type":"text","text":"Numbered list option 1"}]},{"type":"list","format":"ordered","indentLevel":1,"children":[{"type":"list-item","children":[{"type":"text","text":"Sub-option 1A"}]},{"type":"list-item","children":[{"type":"text","text":"Sub-option 1B"}]}]},{"type":"list-item","children":[{"type":"text","text":"Numbered list option 2"}]},{"type":"list","format":"ordered","indentLevel":1,"children":[{"type":"list-item","children":[{"type":"text","text":"Sub-option 2A"}]},{"type":"list-item","children":[{"type":"text","text":"Sub-option 2B"}]}]},{"type":"list-item","children":[{"type":"text","text":"Numbered list option 3"}]}]}]`,
);

describe("mapRichTextBlock", () => {
	it("returns empty array for non-array or failed-parse input", () => {
		expect(mapRichTextBlock(undefined)).toEqual([]);
		expect(mapRichTextBlock(null)).toEqual([]);
		expect(mapRichTextBlock({})).toEqual([]);
		expect(mapRichTextBlock("not-json-shaped")).toEqual([]);
	});

	it("returns empty array when any block fails to parse (strict array)", () => {
		expect(mapRichTextBlock([{ type: "paragraph" }])).toEqual([]);
		expect(
			mapRichTextBlock([
				{
					type: RichTextContentType.Paragraph,
					children: [{ type: RichTextContentType.Text, text: "ok" }],
				},
				{ type: "unknown" },
			]),
		).toEqual([]);
	});

	it("maps footer Strapi blocks fixture with headings, paragraphs, lists, marks, and links", () => {
		const out = mapRichTextBlock(FOOTER_STRAPI_BLOCKS);

		expect(out).toHaveLength(17);
		expect(out.map((b) => b.type)).toEqual([
			RichTextContentType.Heading,
			RichTextContentType.Paragraph,
			RichTextContentType.Paragraph,
			RichTextContentType.Heading,
			RichTextContentType.Paragraph,
			RichTextContentType.Paragraph,
			RichTextContentType.Heading,
			RichTextContentType.Paragraph,
			RichTextContentType.Paragraph,
			RichTextContentType.Paragraph,
			RichTextContentType.Paragraph,
			RichTextContentType.Paragraph,
			RichTextContentType.Paragraph,
			RichTextContentType.Paragraph,
			RichTextContentType.List,
			RichTextContentType.Paragraph,
			RichTextContentType.List,
		]);

		expect(out[0]?.type).toBe(RichTextContentType.Heading);
		if (out[0]?.type === RichTextContentType.Heading) {
			expect(out[0].level).toBe(1);
			expect(out[0].children[0]?.text).toBe("Heading Text Lvl 1");
		}

		expect(out[3]?.type).toBe(RichTextContentType.Heading);
		if (out[3]?.type === RichTextContentType.Heading) {
			expect(out[3].level).toBe(2);
		}

		expect(out[6]?.type).toBe(RichTextContentType.Heading);
		if (out[6]?.type === RichTextContentType.Heading) {
			expect(out[6].level).toBe(3);
		}

		const bold = out[8];
		expect(bold?.type).toBe(RichTextContentType.Paragraph);
		if (bold?.type === RichTextContentType.Paragraph) {
			expect(bold.children[0]).toMatchObject({
				type: RichTextContentType.Text,
				text: "Bold text",
				bold: true,
			});
		}

		const italic = out[9];
		expect(italic?.type).toBe(RichTextContentType.Paragraph);
		if (italic?.type === RichTextContentType.Paragraph) {
			expect(italic.children[0]).toMatchObject({
				type: RichTextContentType.Text,
				text: "Italic text",
				italic: true,
			});
		}

		const underline = out[10];
		expect(underline?.type).toBe(RichTextContentType.Paragraph);
		if (underline?.type === RichTextContentType.Paragraph) {
			expect(underline.children[0]).toMatchObject({
				type: RichTextContentType.Text,
				text: "Underline text",
				underline: true,
			});
		}

		const strike = out[11];
		expect(strike?.type).toBe(RichTextContentType.Paragraph);
		if (strike?.type === RichTextContentType.Paragraph) {
			expect(strike.children[0]).toMatchObject({
				type: RichTextContentType.Text,
				text: "Strike-through text ",
				strikethrough: true,
			});
		}

		const linkParagraph = out[12];
		expect(linkParagraph?.type).toBe(RichTextContentType.Paragraph);
		if (linkParagraph?.type === RichTextContentType.Paragraph) {
			const mid = linkParagraph.children[1];
			expect(mid?.type).toBe(RichTextContentType.Link);
			if (mid?.type === RichTextContentType.Link) {
				expect(mid.url).toBe("https://www.youtube.com/");
				expect(mid.target).toBe("_blank");
				expect(mid.children[0]?.text).toBe("Link text");
			}
		}

		const codeLine = out[13];
		expect(codeLine?.type).toBe(RichTextContentType.Paragraph);
		if (codeLine?.type === RichTextContentType.Paragraph) {
			expect(codeLine.children[0]).toMatchObject({
				type: RichTextContentType.Text,
				text: 'var test = "Inline Code Text";',
				code: true,
			});
		}

		const bulletList = out[14];
		expect(bulletList?.type).toBe(RichTextContentType.List);
		if (bulletList?.type === RichTextContentType.List) {
			expect(bulletList.format).toBe(RichTextListFormat.Unordered);
			expect(bulletList.children).toHaveLength(4);
			expect(bulletList.children[0]?.type).toBe(RichTextContentType.ListItem);
			const nested = bulletList.children[1];
			expect(nested?.type).toBe(RichTextContentType.List);
			if (nested?.type === RichTextContentType.List) {
				expect(nested.format).toBe(RichTextListFormat.Unordered);
				expect(nested.indentLevel).toBe(1);
				expect(nested.children).toHaveLength(2);
			}
			expect(bulletList.children[2]?.type).toBe(RichTextContentType.ListItem);
			expect(bulletList.children[3]?.type).toBe(RichTextContentType.ListItem);
		}

		const numberedList = out[16];
		expect(numberedList?.type).toBe(RichTextContentType.List);
		if (numberedList?.type === RichTextContentType.List) {
			expect(numberedList.format).toBe(RichTextListFormat.Ordered);
			expect(numberedList.children).toHaveLength(5);
			expect(numberedList.children[1]?.type).toBe(RichTextContentType.List);
			expect(numberedList.children[3]?.type).toBe(RichTextContentType.List);
			const nestA = numberedList.children[1];
			const nestB = numberedList.children[3];
			if (
				nestA?.type === RichTextContentType.List &&
				nestB?.type === RichTextContentType.List
			) {
				expect(nestA.format).toBe(RichTextListFormat.Ordered);
				expect(nestA.indentLevel).toBe(1);
				expect(nestB.indentLevel).toBe(1);
			}
		}
	});

	it("maps a minimal valid document", () => {
		const doc: unknown = [
			{
				type: RichTextContentType.Heading,
				level: 2,
				children: [{ type: RichTextContentType.Text, text: "Hi" }],
			},
			{
				type: RichTextContentType.Paragraph,
				children: [{ type: RichTextContentType.Text, text: "Body" }],
			},
		];
		const out = mapRichTextBlock(doc);
		expect(out).toHaveLength(2);
		expect(out[0]?.type).toBe(RichTextContentType.Heading);
		expect(out[1]?.type).toBe(RichTextContentType.Paragraph);
	});
});
