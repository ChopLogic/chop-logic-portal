import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { beforeAll, describe, expect, it } from "vitest";
import {
	RichTextContentType,
	type RichTextInlineNode,
	type RichTextLink,
	type RichTextNode,
	type RichTextParagraph as RichTextParagraphModel,
} from "../../../lib/content/models/rich-text-block";
import { renderRichTextInlineHtml } from "../helpers";
import RichTextParagraph from "../RichTextParagraph.astro";

function textNode(
	text: string,
	flags?: Partial<Omit<RichTextNode, "text" | "type">>,
): RichTextNode {
	return {
		type: RichTextContentType.Text,
		text,
		...flags,
	};
}

function link(props: Omit<RichTextLink, "type">): RichTextLink {
	return {
		type: RichTextContentType.Link,
		...props,
	};
}

describe("RichTextParagraph.astro", () => {
	let container: Awaited<ReturnType<typeof AstroContainer.create>>;

	beforeAll(async () => {
		container = await AstroContainer.create();
	});

	async function render(model: RichTextParagraphModel) {
		return container.renderToString(RichTextParagraph, {
			props: { paragraph: model },
		});
	}

	it("renders a paragraph with inner HTML from children", async () => {
		const html = await render({
			type: RichTextContentType.Paragraph,
			children: [textNode("Hello world")],
		});
		expect(html).toContain("<p");
		expect(html).toContain("</p>");
		expect(html).toContain("Hello world");
	});

	it("renders empty paragraph when there are no children", async () => {
		const html = await render({
			type: RichTextContentType.Paragraph,
			children: [],
		});
		expect(html).toContain("<p");
		expect(html).toContain("</p>");
	});

	it("pipes children through renderRichTextInlineHtml (formatting preserved)", async () => {
		const children = [textNode("Bold bit", { bold: true })];
		const html = await render({
			type: RichTextContentType.Paragraph,
			children,
		});
		const expectedInner = children.map(renderRichTextInlineHtml).join("");
		expect(html).toContain(expectedInner);
		expect(html).toContain("<strong>Bold bit</strong>");
	});

	it("concatenates multiple inline runs", async () => {
		const html = await render({
			type: RichTextContentType.Paragraph,
			children: [
				textNode("Plain"),
				textNode("slant", { italic: true }),
				link({ url: "/more", children: [textNode("link")] }),
			],
		});
		expect(html).toContain("Plain");
		expect(html).toContain("<em>slant</em>");
		expect(html).toContain('<a href="/more">link</a>');
	});

	it("renders links with targets and rel for new tab", async () => {
		const html = await render({
			type: RichTextContentType.Paragraph,
			children: [
				link({
					url: "https://ex.test",
					target: "_blank",
					children: [textNode("Open")],
				}),
			],
		});
		expect(html).toContain('target="_blank"');
		expect(html).toContain('rel="noopener noreferrer"');
		expect(html).toContain("Open");
	});

	it("matches helper output exactly for arbitrary inline nodes", async () => {
		const children: readonly RichTextInlineNode[] = [
			textNode('<>&"'),
			link({
				url: 'https://x?q=1"',
				children: [textNode("in", { code: true })],
			}),
		];
		const html = await render({
			type: RichTextContentType.Paragraph,
			children,
		});
		const expectedInner = children.map(renderRichTextInlineHtml).join("");
		expect(html).toContain(expectedInner);
	});

	it("escapes dangerous text via helpers (no raw angle brackets from content)", async () => {
		const html = await render({
			type: RichTextContentType.Paragraph,
			children: [textNode("<script>")],
		});
		expect(html).toContain("&lt;script&gt;");
		expect(html).not.toContain("<script>");
	});
});
