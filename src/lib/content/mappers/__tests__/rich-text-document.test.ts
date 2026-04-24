import { describe, expect, it } from "vitest";
import {
	RichTextContentType,
	RichTextListFormat,
} from "../../models/rich-text-document";
import { mapJsonStringToRichTextDocument } from "../rich-text-document";

const STRAPI_RICH_TEXT_BLOCK = [
	{
		type: RichTextContentType.Heading,
		level: 1,
		children: [{ type: RichTextContentType.Text, text: "Heading Text Lvl 1" }],
	},
	{
		type: RichTextContentType.Paragraph,
		children: [{ type: RichTextContentType.Text, text: "Regular text" }],
	},
	{
		type: RichTextContentType.Paragraph,
		children: [
			{ type: RichTextContentType.Text, text: "Bold text", bold: true },
		],
	},
	{
		type: RichTextContentType.Paragraph,
		children: [
			{ type: RichTextContentType.Text, text: "Italic text", italic: true },
		],
	},
	{
		type: RichTextContentType.Paragraph,
		children: [
			{ type: RichTextContentType.Text, text: "Underlined", underline: true },
		],
	},
	{
		type: RichTextContentType.Paragraph,
		children: [
			{
				type: RichTextContentType.Text,
				text: "Strikethrough",
				strikethrough: true,
			},
		],
	},
	{
		type: RichTextContentType.Paragraph,
		children: [
			{ type: RichTextContentType.Text, text: "" },
			{
				type: RichTextContentType.Link,
				url: "https://www.youtube.com/",
				target: "_blank",
				children: [{ type: RichTextContentType.Text, text: "Link text" }],
			},
			{ type: RichTextContentType.Text, text: "" },
		],
	},
	{
		type: RichTextContentType.Paragraph,
		children: [
			{
				type: RichTextContentType.Text,
				text: 'var test = "Inline Code Text";',
				code: true,
			},
		],
	},
	{
		type: RichTextContentType.List,
		format: RichTextListFormat.Unordered,
		children: [
			{
				type: RichTextContentType.ListItem,
				children: [
					{
						type: RichTextContentType.Text,
						text: "Bulleted list option 1",
					},
				],
			},
			{
				type: RichTextContentType.List,
				format: RichTextListFormat.Unordered,
				indentLevel: 1,
				children: [
					{
						type: RichTextContentType.ListItem,
						children: [
							{ type: RichTextContentType.Text, text: "Sub-option 1" },
						],
					},
				],
			},
		],
	},
	{
		type: RichTextContentType.List,
		format: RichTextListFormat.Ordered,
		children: [
			{
				type: RichTextContentType.ListItem,
				children: [
					{
						type: RichTextContentType.Text,
						text: "Numbered list option 1",
					},
				],
			},
			{
				type: RichTextContentType.List,
				format: RichTextListFormat.Ordered,
				indentLevel: 1,
				children: [
					{
						type: RichTextContentType.ListItem,
						children: [
							{ type: RichTextContentType.Text, text: "Sub-option 1A" },
						],
					},
				],
			},
		],
	},
];

describe("mapJsonStringToRichTextDocument", () => {
	it("maps Strapi-like footer fixture when passed as one rich-text document", () => {
		const result = mapJsonStringToRichTextDocument(
			JSON.stringify([STRAPI_RICH_TEXT_BLOCK]),
		);

		expect(result).toHaveLength(1);
		expect(result[0]).toHaveLength(STRAPI_RICH_TEXT_BLOCK.length);
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

	it("preserves inline formatting and link attributes", () => {
		const [doc] = mapJsonStringToRichTextDocument(
			JSON.stringify([STRAPI_RICH_TEXT_BLOCK]),
		);

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
		const [doc] = mapJsonStringToRichTextDocument(
			JSON.stringify([STRAPI_RICH_TEXT_BLOCK]),
		);
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
		expect(
			mapJsonStringToRichTextDocument(JSON.stringify(STRAPI_RICH_TEXT_BLOCK)),
		).toEqual([]);
	});

	it("supports parsing multiple valid documents", () => {
		const secondDocument = [
			{
				type: RichTextContentType.Paragraph,
				children: [{ type: RichTextContentType.Text, text: "Second document" }],
			},
			{
				type: RichTextContentType.Heading,
				level: 3,
				children: [{ type: RichTextContentType.Text, text: "Nested heading" }],
			},
		];

		const result = mapJsonStringToRichTextDocument(
			JSON.stringify([STRAPI_RICH_TEXT_BLOCK, secondDocument]),
		);

		expect(result).toHaveLength(2);
		expect(result[1]?.[0]).toMatchObject({
			type: RichTextContentType.Paragraph,
		});
		expect(result[1]?.[1]).toMatchObject({
			type: RichTextContentType.Heading,
			level: 3,
		});
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
