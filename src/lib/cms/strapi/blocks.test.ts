import { describe, expect, it } from "vitest";
import { blocksToHtml, blocksToPlainText } from "./blocks";

describe("blocksToPlainText", () => {
	it("extracts text from paragraphs", () => {
		const blocks = [
			{
				type: "paragraph",
				children: [
					{ type: "text", text: "Hello " },
					{ type: "text", text: "world" },
				],
			},
		];
		expect(blocksToPlainText(blocks)).toBe("Hello world");
	});

	it("returns empty for non-array", () => {
		expect(blocksToPlainText(null)).toBe("");
	});
});

describe("blocksToHtml", () => {
	it("renders paragraph and bold text", () => {
		const blocks = [
			{
				type: "paragraph",
				children: [
					{ type: "text", text: "Hi ", bold: false },
					{ type: "text", text: "there", bold: true },
				],
			},
		];
		expect(blocksToHtml(blocks)).toBe("<p>Hi <strong>there</strong></p>");
	});

	it("renders links", () => {
		const blocks = [
			{
				type: "paragraph",
				children: [
					{
						type: "link",
						url: "https://example.com",
						children: [{ type: "text", text: "link" }],
					},
				],
			},
		];
		expect(blocksToHtml(blocks)).toBe(
			'<p><a href="https://example.com">link</a></p>',
		);
	});
});
