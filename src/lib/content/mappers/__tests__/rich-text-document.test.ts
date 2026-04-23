import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
	RichTextContentType,
	RichTextListFormat,
} from "../../models/rich-text-document";
import { mapJsonStringToRichTextDocument } from "../rich-text-document";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const mockPath = path.join(
	__dirname,
	"../../../strapi/__mocks__/fetch-config-response.json",
);

function getMockFooter(): unknown[] {
	const root = JSON.parse(fs.readFileSync(mockPath, "utf8")) as {
		data?: { config?: { footer?: unknown[] } };
	};
	const footer = root.data?.config?.footer;
	if (!Array.isArray(footer)) {
		throw new Error("Mock footer is missing or invalid");
	}
	return footer;
}

describe("mapJsonStringToRichTextDocument", () => {
	it("maps Strapi mock footer when passed as a single rich-text document", () => {
		const footer = getMockFooter();
		const result = mapJsonStringToRichTextDocument(JSON.stringify([footer]));

		expect(result).toHaveLength(1);
		expect(result[0]).toHaveLength(footer.length);
		expect(result[0]?.[0]).toMatchObject({
			type: RichTextContentType.Heading,
			level: 1,
		});

		const unorderedList = result[0]?.find(
			(block) =>
				block.type === RichTextContentType.List &&
				block.format === RichTextListFormat.Unordered,
		);
		const orderedList = result[0]?.find(
			(block) =>
				block.type === RichTextContentType.List &&
				block.format === RichTextListFormat.Ordered,
		);
		expect(unorderedList).toBeTruthy();
		expect(orderedList).toBeTruthy();
	});

	it("preserves inline formatting and link attributes from Strapi payload", () => {
		const footer = getMockFooter();
		const [doc] = mapJsonStringToRichTextDocument(JSON.stringify([footer]));

		const paragraphBlocks = doc?.filter(
			(block) => block.type === RichTextContentType.Paragraph,
		);
		const bold = paragraphBlocks?.find((paragraph) =>
			paragraph.children.some(
				(child) =>
					child.type === RichTextContentType.Text && child.bold === true,
			),
		);
		const italic = paragraphBlocks?.find((paragraph) =>
			paragraph.children.some(
				(child) =>
					child.type === RichTextContentType.Text && child.italic === true,
			),
		);
		const underline = paragraphBlocks?.find((paragraph) =>
			paragraph.children.some(
				(child) =>
					child.type === RichTextContentType.Text && child.underline === true,
			),
		);
		const strikethrough = paragraphBlocks?.find((paragraph) =>
			paragraph.children.some(
				(child) =>
					child.type === RichTextContentType.Text &&
					child.strikethrough === true,
			),
		);
		const withLink = paragraphBlocks?.find((paragraph) =>
			paragraph.children.some(
				(child) => child.type === RichTextContentType.Link,
			),
		);
		const inlineCode = paragraphBlocks?.find((paragraph) =>
			paragraph.children.some(
				(child) =>
					child.type === RichTextContentType.Text && child.code === true,
			),
		);

		expect(bold).toBeTruthy();
		expect(italic).toBeTruthy();
		expect(underline).toBeTruthy();
		expect(strikethrough).toBeTruthy();
		expect(withLink).toMatchObject({
			type: RichTextContentType.Paragraph,
		});
		expect(withLink?.children).toContainEqual(
			expect.objectContaining({
				type: RichTextContentType.Link,
				url: "https://www.youtube.com/",
				target: "_blank",
			}),
		);
		expect(inlineCode).toMatchObject({
			type: RichTextContentType.Paragraph,
		});
		expect(inlineCode?.children).toContainEqual(
			expect.objectContaining({ type: RichTextContentType.Text, code: true }),
		);
	});

	it("parses nested ordered and unordered lists including indentLevel", () => {
		const footer = getMockFooter();
		const [doc] = mapJsonStringToRichTextDocument(JSON.stringify([footer]));
		const unorderedList = doc?.find(
			(block) =>
				block.type === RichTextContentType.List &&
				block.format === RichTextListFormat.Unordered,
		);
		const orderedList = doc?.find(
			(block) =>
				block.type === RichTextContentType.List &&
				block.format === RichTextListFormat.Ordered,
		);

		expect(unorderedList).toMatchObject({
			type: RichTextContentType.List,
			format: RichTextListFormat.Unordered,
		});
		expect(
			unorderedList?.children.some(
				(child) =>
					child.type === RichTextContentType.List &&
					child.format === RichTextListFormat.Unordered &&
					child.indentLevel === 1,
			),
		).toBe(true);

		expect(orderedList).toMatchObject({
			type: RichTextContentType.List,
			format: RichTextListFormat.Ordered,
		});
		expect(
			orderedList?.children.some(
				(child) =>
					child.type === RichTextContentType.List &&
					child.format === RichTextListFormat.Ordered &&
					child.indentLevel === 1,
			),
		).toBe(true);
	});

	it("returns an empty array for malformed JSON", () => {
		expect(mapJsonStringToRichTextDocument("{ not-json")).toEqual([]);
	});

	it("returns an empty array when top-level parsed value is not an array", () => {
		expect(
			mapJsonStringToRichTextDocument(JSON.stringify({ foo: "bar" })),
		).toEqual([]);
	});

	it("returns an empty array when payload is a single document instead of document array", () => {
		const footer = getMockFooter();
		expect(mapJsonStringToRichTextDocument(JSON.stringify(footer))).toEqual([]);
	});

	it("returns an empty array when any block in a document is invalid", () => {
		const invalidDocument = [
			{
				type: RichTextContentType.Paragraph,
				children: [{ type: RichTextContentType.Text, text: "ok" }],
			},
			{
				type: RichTextContentType.Heading,
				children: [{ type: RichTextContentType.Text, text: "missing level" }],
			},
		];

		expect(
			mapJsonStringToRichTextDocument(JSON.stringify([invalidDocument])),
		).toEqual([]);
	});

	it("returns an empty array when list format is invalid", () => {
		const invalidListDocument = [
			{
				type: RichTextContentType.List,
				format: "roman",
				children: [
					{
						type: RichTextContentType.ListItem,
						children: [{ type: RichTextContentType.Text, text: "item" }],
					},
				],
			},
		];

		expect(
			mapJsonStringToRichTextDocument(JSON.stringify([invalidListDocument])),
		).toEqual([]);
	});

	it("returns an empty array when link contains non-text children", () => {
		const invalidLinkDocument = [
			{
				type: RichTextContentType.Paragraph,
				children: [
					{
						type: RichTextContentType.Link,
						url: "https://example.com",
						children: [
							{
								type: RichTextContentType.Paragraph,
								children: [],
							},
						],
					},
				],
			},
		];

		expect(
			mapJsonStringToRichTextDocument(JSON.stringify([invalidLinkDocument])),
		).toEqual([]);
	});
});
