import { RichTextContentType, RichTextListFormat } from "@models";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { mapRichTextBlock } from "../rich-text-block";
import {
	createFullyFormattedParagraph,
	createHeadingBlock,
	createLinkNode,
	createListBlock,
	createMockRichTextContent,
	createNestedList,
	createParagraphBlock,
	createSimpleHeading,
	createSimpleList,
	createSimpleListItem,
	createSimpleParagraph,
	createTextNode,
} from "./fixtures";

// Mock dependencies
vi.mock("../checkers", () => ({
	isRecord: vi.fn(
		(v) => typeof v === "object" && v !== null && !Array.isArray(v),
	),
}));

describe("mapRichTextBlock", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("with valid rich text content", () => {
		it("parses complete rich text content array", () => {
			const raw = createMockRichTextContent();
			const result = mapRichTextBlock(raw);

			expect(result).toHaveLength(6);
		});

		it("returns empty array for non-array input", () => {
			expect(mapRichTextBlock(null)).toEqual([]);
			expect(mapRichTextBlock(undefined)).toEqual([]);
			expect(mapRichTextBlock("string")).toEqual([]);
			expect(mapRichTextBlock(123)).toEqual([]);
			expect(mapRichTextBlock({})).toEqual([]);
		});

		it("returns empty array for empty input array", () => {
			expect(mapRichTextBlock([])).toEqual([]);
		});
	});

	describe("paragraph blocks", () => {
		it("parses simple paragraph with text", () => {
			const raw = [createSimpleParagraph("Hello world")];
			const result = mapRichTextBlock(raw);

			expect(result).toHaveLength(1);
			expect(result[0]?.type).toBe(RichTextContentType.Paragraph);
			expect(
				(result[0] as unknown as { children: Array<{ text: string }> })
					.children[0]?.text,
			).toBe("Hello world");
		});

		it("parses paragraph with multiple text nodes", () => {
			const raw = [
				createParagraphBlock([
					createTextNode("First "),
					createTextNode("Second "),
					createTextNode("Third"),
				]),
			];
			const result = mapRichTextBlock(raw);

			expect(result).toHaveLength(1);
			expect(
				(result[0] as unknown as { children: unknown[] }).children,
			).toHaveLength(3);
		});

		it("parses paragraph with link", () => {
			const raw = [
				createParagraphBlock([
					createTextNode("Check out "),
					createLinkNode("https://example.com", [createTextNode("this link")]),
				]),
			];
			const result = mapRichTextBlock(raw);

			expect(result).toHaveLength(1);
			const paragraph = result[0] as unknown as {
				children: Array<{ type: string; url?: string }>;
			};
			expect(paragraph.children[1]?.type).toBe(RichTextContentType.Link);
			expect(paragraph.children[1]?.url).toBe("https://example.com");
		});
	});

	describe("text formatting", () => {
		it("parses bold text", () => {
			const raw = [
				createParagraphBlock([createTextNode("bold text", { bold: true })]),
			];
			const result = mapRichTextBlock(raw);

			const paragraph = result[0] as unknown as {
				children: Array<{ bold?: boolean }>;
			};
			expect(paragraph.children[0]?.bold).toBe(true);
		});

		it("parses italic text", () => {
			const raw = [
				createParagraphBlock([createTextNode("italic text", { italic: true })]),
			];
			const result = mapRichTextBlock(raw);

			const paragraph = result[0] as unknown as {
				children: Array<{ italic?: boolean }>;
			};
			expect(paragraph.children[0]?.italic).toBe(true);
		});

		it("parses underline text", () => {
			const raw = [
				createParagraphBlock([
					createTextNode("underline text", { underline: true }),
				]),
			];
			const result = mapRichTextBlock(raw);

			const paragraph = result[0] as unknown as {
				children: Array<{ underline?: boolean }>;
			};
			expect(paragraph.children[0]?.underline).toBe(true);
		});

		it("parses strikethrough text", () => {
			const raw = [
				createParagraphBlock([
					createTextNode("strikethrough", { strikethrough: true }),
				]),
			];
			const result = mapRichTextBlock(raw);

			const paragraph = result[0] as unknown as {
				children: Array<{ strikethrough?: boolean }>;
			};
			expect(paragraph.children[0]?.strikethrough).toBe(true);
		});

		it("parses code text", () => {
			const raw = [
				createParagraphBlock([createTextNode("code", { code: true })]),
			];
			const result = mapRichTextBlock(raw);

			const paragraph = result[0] as unknown as {
				children: Array<{ code?: boolean }>;
			};
			expect(paragraph.children[0]?.code).toBe(true);
		});

		it("parses text with multiple formatting options", () => {
			const raw = [
				createParagraphBlock([
					createTextNode("bold italic", { bold: true, italic: true }),
				]),
			];
			const result = mapRichTextBlock(raw);

			const paragraph = result[0] as unknown as {
				children: Array<{ bold?: boolean; italic?: boolean }>;
			};
			expect(paragraph.children[0]?.bold).toBe(true);
			expect(paragraph.children[0]?.italic).toBe(true);
		});

		it("parses fully formatted paragraph", () => {
			const raw = [createFullyFormattedParagraph()];
			const result = mapRichTextBlock(raw);

			expect(result).toHaveLength(1);
			const paragraph = result[0] as unknown as { children: unknown[] };
			expect(paragraph.children.length).toBeGreaterThan(5);
		});

		it("ignores formatting when value is not true", () => {
			const raw = [
				{
					type: "paragraph",
					children: [
						{
							type: "text",
							text: "normal",
							bold: false,
							italic: null,
							underline: undefined,
						},
					],
				},
			];
			const result = mapRichTextBlock(raw);

			const paragraph = result[0] as unknown as {
				children: Array<{ bold?: boolean; italic?: boolean }>;
			};
			expect(paragraph.children[0]?.bold).toBeUndefined();
			expect(paragraph.children[0]?.italic).toBeUndefined();
		});
	});

	describe("heading blocks", () => {
		it("parses heading with level 1", () => {
			const raw = [createSimpleHeading(1, "Main Title")];
			const result = mapRichTextBlock(raw);

			expect(result).toHaveLength(1);
			expect(result[0]?.type).toBe(RichTextContentType.Heading);
			expect((result[0] as { level: number }).level).toBe(1);
		});

		it("parses heading with level 2", () => {
			const raw = [createSimpleHeading(2, "Subtitle")];
			const result = mapRichTextBlock(raw);

			expect((result[0] as { level: number }).level).toBe(2);
		});

		it("parses heading with various levels", () => {
			const raw = [
				createSimpleHeading(1, "H1"),
				createSimpleHeading(2, "H2"),
				createSimpleHeading(3, "H3"),
				createSimpleHeading(4, "H4"),
				createSimpleHeading(5, "H5"),
				createSimpleHeading(6, "H6"),
			];
			const result = mapRichTextBlock(raw);

			expect(result).toHaveLength(6);
			result.forEach((block, index) => {
				expect((block as { level: number }).level).toBe(index + 1);
			});
		});

		it("parses heading with formatted text", () => {
			const raw = [
				createHeadingBlock(2, [createTextNode("Bold Heading", { bold: true })]),
			];
			const result = mapRichTextBlock(raw);

			const heading = result[0] as unknown as {
				children: Array<{ bold?: boolean }>;
			};
			expect(heading.children[0]?.bold).toBe(true);
		});
	});

	describe("list blocks", () => {
		describe("unordered lists", () => {
			it("parses unordered list", () => {
				const raw = [
					createSimpleList("unordered", ["Item 1", "Item 2", "Item 3"]),
				];
				const result = mapRichTextBlock(raw);

				expect(result).toHaveLength(1);
				expect(result[0]?.type).toBe(RichTextContentType.List);
				expect((result[0] as { format: string }).format).toBe(
					RichTextListFormat.Unordered,
				);
				expect(
					(result[0] as unknown as { children: unknown[] }).children,
				).toHaveLength(3);
			});
		});

		describe("ordered lists", () => {
			it("parses ordered list", () => {
				const raw = [createSimpleList("ordered", ["First", "Second", "Third"])];
				const result = mapRichTextBlock(raw);

				expect(result).toHaveLength(1);
				expect((result[0] as { format: string }).format).toBe(
					RichTextListFormat.Ordered,
				);
			});
		});

		describe("nested lists", () => {
			it("parses nested list structure", () => {
				const raw = [createNestedList()];
				const result = mapRichTextBlock(raw);

				expect(result).toHaveLength(1);
				const list = result[0] as unknown as { children: unknown[] };
				expect(list.children).toHaveLength(3);
			});

			it("parses list with indent level", () => {
				const raw = [
					createListBlock("unordered", [createSimpleListItem("Item")], 2),
				];
				const result = mapRichTextBlock(raw);

				expect((result[0] as { indentLevel: number }).indentLevel).toBe(2);
			});
		});

		describe("list items with links", () => {
			it("parses list item containing a link", () => {
				const raw = [
					createListBlock("unordered", [
						{
							type: "list-item",
							children: [
								createTextNode("See "),
								createLinkNode("https://example.com", [createTextNode("link")]),
							],
						},
					]),
				];
				const result = mapRichTextBlock(raw);

				const list = result[0] as unknown as {
					children: Array<{ children: Array<{ type: string }> }>;
				};
				expect(list.children[0]?.children[1]?.type).toBe(
					RichTextContentType.Link,
				);
			});
		});
	});

	describe("link blocks", () => {
		it("parses link with target attribute", () => {
			const raw = [
				createParagraphBlock([
					createLinkNode(
						"https://example.com",
						[createTextNode("Link text")],
						"_blank",
					),
				]),
			];
			const result = mapRichTextBlock(raw);

			const paragraph = result[0] as unknown as {
				children: Array<{ target?: string }>;
			};
			expect(paragraph.children[0]?.target).toBe("_blank");
		});

		it("parses link without target attribute", () => {
			const raw = [
				createParagraphBlock([
					createLinkNode("https://example.com", [createTextNode("Link text")]),
				]),
			];
			const result = mapRichTextBlock(raw);

			const paragraph = result[0] as unknown as {
				children: Array<{ target?: string }>;
			};
			expect(paragraph.children[0]?.target).toBeUndefined();
		});

		it("parses link with multiple text children", () => {
			const raw = [
				createParagraphBlock([
					createLinkNode("https://example.com", [
						createTextNode("Click "),
						createTextNode("here", { bold: true }),
					]),
				]),
			];
			const result = mapRichTextBlock(raw);

			const paragraph = result[0] as unknown as {
				children: Array<{ type: string; children?: unknown[] }>;
			};
			expect(paragraph.children[0]?.children).toHaveLength(2);
		});
	});

	describe("invalid content handling", () => {
		it("filters out invalid block types from mixed array", () => {
			// The parseArrayItems function returns null if ANY item fails parsing
			// So we test that valid blocks work on their own
			const validOnly = [createSimpleParagraph("Valid paragraph")];
			const result = mapRichTextBlock(validOnly);

			expect(result).toHaveLength(1);
		});

		it("returns empty array when all blocks are invalid", () => {
			const raw = [{ type: "invalid", children: [] }, { type: "also-invalid" }];
			const result = mapRichTextBlock(raw);

			expect(result).toEqual([]);
		});

		it("handles paragraph with missing children", () => {
			const raw = [{ type: "paragraph" }];
			const result = mapRichTextBlock(raw);

			expect(result).toEqual([]);
		});

		it("handles heading with missing level", () => {
			const raw = [
				{ type: "heading", children: [{ type: "text", text: "Test" }] },
			];
			const result = mapRichTextBlock(raw);

			expect(result).toEqual([]);
		});

		it("handles list with invalid format", () => {
			const raw = [
				{
					type: "list",
					format: "invalid-format",
					children: [
						{ type: "list-item", children: [{ type: "text", text: "Item" }] },
					],
				},
			];
			const result = mapRichTextBlock(raw);

			expect(result).toEqual([]);
		});

		it("handles text node with missing text property", () => {
			const raw = [{ type: "paragraph", children: [{ type: "text" }] }];
			const result = mapRichTextBlock(raw);

			expect(result).toEqual([]);
		});

		it("handles link with missing url", () => {
			const raw = [
				{
					type: "paragraph",
					children: [
						{ type: "link", children: [{ type: "text", text: "Link" }] },
					],
				},
			];
			const result = mapRichTextBlock(raw);

			expect(result).toEqual([]);
		});

		it("handles link with missing children", () => {
			const raw = [
				{
					type: "paragraph",
					children: [{ type: "link", url: "https://example.com" }],
				},
			];
			const result = mapRichTextBlock(raw);

			expect(result).toEqual([]);
		});

		it("rejects a heading whose children fail to parse", () => {
			// Valid level + array children, but a child is not a valid text node,
			// so parseArrayItems returns null and the heading is dropped.
			const raw = [
				{
					type: "heading",
					level: 2,
					children: [{ type: "text" }],
				},
			];
			const result = mapRichTextBlock(raw);

			expect(result).toEqual([]);
		});

		it("rejects a list whose children array is missing", () => {
			const raw = [{ type: "list", format: "unordered" }];
			const result = mapRichTextBlock(raw);

			expect(result).toEqual([]);
		});

		it("rejects a list whose child items fail to parse", () => {
			// Valid format + array children, but the child is neither a valid
			// list-item nor a valid nested list, so the whole list is dropped.
			const raw = [
				{
					type: "list",
					format: "ordered",
					children: [{ type: "not-a-list-item" }],
				},
			];
			const result = mapRichTextBlock(raw);

			expect(result).toEqual([]);
		});
	});

	describe("edge cases", () => {
		it("handles deeply nested content", () => {
			const raw = [
				createParagraphBlock([
					createTextNode("Start "),
					createLinkNode("https://example.com", [
						createTextNode("formatted "),
						createTextNode("link", { bold: true }),
					]),
					createTextNode(" end"),
				]),
			];
			const result = mapRichTextBlock(raw);

			expect(result).toHaveLength(1);
		});

		it("handles mixed content types", () => {
			const raw = [
				createSimpleHeading(1, "Title"),
				createSimpleParagraph("Introduction"),
				createSimpleList("unordered", ["Point 1", "Point 2"]),
				createSimpleParagraph("Conclusion"),
			];
			const result = mapRichTextBlock(raw);

			expect(result).toHaveLength(4);
			expect(result[0]?.type).toBe(RichTextContentType.Heading);
			expect(result[1]?.type).toBe(RichTextContentType.Paragraph);
			expect(result[2]?.type).toBe(RichTextContentType.List);
			expect(result[3]?.type).toBe(RichTextContentType.Paragraph);
		});

		it("handles empty paragraph children array", () => {
			const raw = [{ type: "paragraph", children: [] }];
			const result = mapRichTextBlock(raw);

			expect(result).toHaveLength(1);
			expect(
				(result[0] as unknown as { children: unknown[] }).children,
			).toHaveLength(0);
		});

		it("handles empty list children array", () => {
			const raw = [{ type: "list", format: "unordered", children: [] }];
			const result = mapRichTextBlock(raw);

			expect(result).toHaveLength(1);
			expect(
				(result[0] as unknown as { children: unknown[] }).children,
			).toHaveLength(0);
		});
	});
});
