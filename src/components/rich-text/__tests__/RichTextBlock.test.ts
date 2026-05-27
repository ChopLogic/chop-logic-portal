import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { beforeAll, describe, expect, it } from "vitest";
import {
	type RichTextContent,
	RichTextContentType,
	type RichTextHeading,
	type RichTextItem,
	type RichTextLink,
	type RichTextList,
	RichTextListFormat,
	type RichTextListItem,
	type RichTextNode,
} from "../../../lib/content/models/rich-text-block";
import RichTextBlock from "../RichTextBlock.astro";

function textNode(
	content: string,
	flags?: Partial<Omit<RichTextNode, "text" | "type">>,
): RichTextNode {
	return {
		type: RichTextContentType.Text,
		text: content,
		...flags,
	};
}

function link(props: Omit<RichTextLink, "type">): RichTextLink {
	return {
		type: RichTextContentType.Link,
		...props,
	};
}

function listItem(children: RichTextListItem["children"]): RichTextListItem {
	return {
		type: RichTextContentType.ListItem,
		children,
	};
}

function blockList(
	format: RichTextListFormat,
	children: RichTextList["children"],
	indentLevel?: number,
): RichTextList {
	return {
		type: RichTextContentType.List,
		format,
		children,
		...(indentLevel !== undefined ? { indentLevel } : {}),
	};
}

describe("RichTextBlock.astro", () => {
	let container: Awaited<ReturnType<typeof AstroContainer.create>>;

	beforeAll(async () => {
		container = await AstroContainer.create();
	});

	async function render(content: RichTextContent) {
		return container.renderToString(RichTextBlock, {
			props: { content },
		});
	}

	it("renders a heading block", async () => {
		const html = await render([
			{
				type: RichTextContentType.Heading,
				level: 3,
				children: [textNode("Title")],
			} satisfies RichTextHeading,
		]);
		expect(html).toContain("<h3");
		expect(html).toContain("Title");
		expect(html).toContain("</h3>");
	});

	it("renders a paragraph block", async () => {
		const html = await render([
			{
				type: RichTextContentType.Paragraph,
				children: [
					textNode("Body"),
					link({ url: "/x", children: [textNode("link")] }),
				],
			},
		]);
		expect(html).toContain("<p");
		expect(html).toContain("Body");
		expect(html).toContain('<a href="/x">link</a>');
	});

	it("renders a list block", async () => {
		const html = await render([
			blockList(RichTextListFormat.Unordered, [
				listItem([textNode("first")]),
				listItem([textNode("second")]),
			]),
		]);
		expect(html).toContain("<ul");
		expect(html).toContain("<li>first</li>");
		expect(html).toContain("<li>second</li>");
	});

	it("renders mixed blocks in source order", async () => {
		const html = await render([
			{
				type: RichTextContentType.Heading,
				level: 2,
				children: [textNode("H")],
			},
			{
				type: RichTextContentType.Paragraph,
				children: [textNode("P")],
			},
			blockList(RichTextListFormat.Ordered, [listItem([textNode("L")])]),
		]);
		const iH = html.indexOf("<h2");
		const iP = html.indexOf("<p");
		const iOl = html.indexOf("<ol");
		expect(iH).toBeGreaterThanOrEqual(0);
		expect(iP).toBeGreaterThan(iH);
		expect(iOl).toBeGreaterThan(iP);
		expect(html.indexOf("H", iH)).toBeGreaterThanOrEqual(0);
		expect(html.indexOf("P", iP)).toBeGreaterThanOrEqual(0);
		expect(html.indexOf("L")).toBeGreaterThanOrEqual(0);
	});

	it("renders nothing when content is empty", async () => {
		const html = await render([]);
		expect(html).toBe("");
	});

	it("skips unsupported top-level node types (renders null)", async () => {
		const html = await render([
			{
				type: RichTextContentType.Paragraph,
				children: [textNode("visible")],
			},
			{
				type: RichTextContentType.ListItem,
				children: [textNode("should not appear")],
			} as unknown as RichTextItem,
		] as RichTextContent);

		expect(html).toContain("visible");
		expect(html).not.toContain("should not appear");
	});
});
