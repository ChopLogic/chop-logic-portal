import { describe, expect, it } from "vitest";
import {
	RichTextContentType,
	type RichTextInlineNode,
	type RichTextLink,
	type RichTextList,
	RichTextListFormat,
	type RichTextListItem,
	type RichTextNode,
} from "../../../lib/content/models/rich-text-block";
import {
	escapeHtml,
	renderListItemInnerHtml,
	renderRichTextInlineHtml,
	renderRichTextLinkHtml,
	renderRichTextListBodyHtml,
	renderRichTextListHtml,
	renderRichTextNodeHtml,
} from "../helpers";

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

function list(
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

describe("escapeHtml", () => {
	it("escapes ampersand, angle brackets, and double quotes", () => {
		/* `&` is escaped first so `<` / `>` in `&amp;…` stay as literal angle entities */
		expect(escapeHtml(`<&>"`)).toBe("&lt;&amp;&gt;&quot;");
	});

	it("returns empty string unchanged", () => {
		expect(escapeHtml("")).toBe("");
	});

	it("does not escape single quotes", () => {
		expect(escapeHtml("'")).toBe("'");
	});

	it("escapes multiple occurrences", () => {
		expect(escapeHtml("<<>>")).toBe("&lt;&lt;&gt;&gt;");
	});
});

describe("renderRichTextNodeHtml", () => {
	it("escapes plain text", () => {
		expect(renderRichTextNodeHtml(textNode("<script>"))).toBe("&lt;script&gt;");
	});

	it("wraps markup flags from innermost to outermost in code → del → u → em → strong order", () => {
		expect(
			renderRichTextNodeHtml(
				textNode("x", {
					code: true,
					strikethrough: true,
					underline: true,
					italic: true,
					bold: true,
				}),
			),
		).toBe("<strong><em><u><del><code>x</code></del></u></em></strong>");
	});

	it("applies only requested wrappers", () => {
		expect(renderRichTextNodeHtml(textNode("a", { bold: true }))).toBe(
			"<strong>a</strong>",
		);
		expect(renderRichTextNodeHtml(textNode("a", { italic: true }))).toBe(
			"<em>a</em>",
		);
	});

	it("treats explicit false like absent (no wrapper)", () => {
		expect(
			renderRichTextNodeHtml(
				textNode("z", {
					bold: false,
					italic: false,
					code: false,
				}),
			),
		).toBe("z");
	});

	it("escapes text before wrapping so payload cannot break out of tags", () => {
		expect(
			renderRichTextNodeHtml(textNode("</strong><script>", { bold: true })),
		).toBe("<strong>&lt;/strong&gt;&lt;script&gt;</strong>");
	});
});

describe("renderRichTextLinkHtml", () => {
	it("renders href and inner nodes with escaped url", () => {
		expect(
			renderRichTextLinkHtml(
				link({
					url: 'https://x.test?q=a&b=c"',
					target: "_self",
					children: [textNode("Label")],
				}),
			),
		).toBe(
			'<a href="https://x.test?q=a&amp;b=c&quot;" target="_self">Label</a>',
		);
	});

	it("adds target attribute when non-empty", () => {
		expect(
			renderRichTextLinkHtml(
				link({ url: "/", target: "_blank", children: [textNode("x")] }),
			),
		).toBe('<a href="/" target="_blank" rel="noopener noreferrer">x</a>');
	});

	it('adds rel noopener for target "blank"', () => {
		expect(
			renderRichTextLinkHtml(
				link({ url: "/", target: "blank", children: [textNode("x")] }),
			),
		).toContain('rel="noopener noreferrer"');
	});

	it("omits target attribute when missing or empty string", () => {
		expect(
			renderRichTextLinkHtml(link({ url: "/", children: [textNode("a")] })),
		).toBe('<a href="/">a</a>');
		expect(
			renderRichTextLinkHtml(
				link({ url: "/", target: "", children: [textNode("b")] }),
			),
		).toBe('<a href="/">b</a>');
	});

	it("maps rich text inside the link", () => {
		expect(
			renderRichTextLinkHtml(
				link({
					url: "/u",
					children: [textNode("b", { bold: true }), textNode("old")],
				}),
			),
		).toBe('<a href="/u"><strong>b</strong>old</a>');
	});
});

describe("renderRichTextInlineHtml", () => {
	it("delegates to node or link renderer", () => {
		expect(renderRichTextInlineHtml(textNode("t"))).toBe("t");
		expect(
			renderRichTextInlineHtml(link({ url: "/", children: [textNode("i")] })),
		).toBe('<a href="/">i</a>');
	});

	it("returns empty string for unsupported node shape", () => {
		const orphan = {
			type: RichTextContentType.Paragraph,
			children: [],
		} as unknown as RichTextInlineNode;
		expect(renderRichTextInlineHtml(orphan)).toBe("");
	});
});

describe("renderListItemInnerHtml", () => {
	it("concatenates inline children", () => {
		const item = listItem([
			textNode("a"),
			link({ url: "/z", children: [textNode("b")] }),
		]);
		expect(renderListItemInnerHtml(item)).toBe('a<a href="/z">b</a>');
	});
});

describe("renderRichTextListHtml & renderRichTextListBodyHtml", () => {
	it("uses ul for unordered and ol for ordered format", () => {
		const ul = list(RichTextListFormat.Unordered, [
			listItem([textNode("one")]),
		]);
		expect(renderRichTextListHtml(ul)).toBe("<ul><li>one</li></ul>");
		expect(renderRichTextListBodyHtml(ul)).toBe("<li>one</li>");

		const ol = list(RichTextListFormat.Ordered, [listItem([textNode("two")])]);
		expect(renderRichTextListHtml(ol)).toBe("<ol><li>two</li></ol>");
	});

	it("adds data-indent-level only for finite numeric indentLevel", () => {
		expect(
			renderRichTextListHtml(
				list(RichTextListFormat.Unordered, [listItem([textNode("x")])], 2),
			),
		).toBe('<ul data-indent-level="2"><li>x</li></ul>');

		expect(
			renderRichTextListHtml(
				list(RichTextListFormat.Unordered, [listItem([textNode("x")])], NaN),
			),
		).toBe("<ul><li>x</li></ul>");

		expect(
			renderRichTextListHtml(
				list(
					RichTextListFormat.Unordered,
					[listItem([textNode("x")])],
					Number.POSITIVE_INFINITY,
				),
			),
		).toBe("<ul><li>x</li></ul>");
	});

	it("merges trailing sibling lists into the preceding list-item (Strapi shape)", () => {
		const nested = list(RichTextListFormat.Unordered, [
			listItem([textNode("nested")]),
		]);
		const root = list(RichTextListFormat.Ordered, [
			listItem([textNode("outer")]),
			nested,
		]);
		expect(renderRichTextListHtml(root)).toBe(
			"<ol><li>outer<ul><li>nested</li></ul></li></ol>",
		);
	});

	it("wraps a bare child list in li when it is not preceded by list-item", () => {
		const inner = list(RichTextListFormat.Unordered, [
			listItem([textNode("in")]),
		]);
		const root = list(RichTextListFormat.Ordered, [inner]);
		expect(renderRichTextListHtml(root)).toBe(
			"<ol><li><ul><li>in</li></ul></li></ol>",
		);
	});

	it("body html matches list inner without outer tags", () => {
		const root = list(RichTextListFormat.Unordered, [
			listItem([textNode("a")]),
			listItem([textNode("b")]),
		]);
		expect(renderRichTextListBodyHtml(root)).toBe("<li>a</li><li>b</li>");
		expect(renderRichTextListHtml(root)).toBe(
			`<ul>${renderRichTextListBodyHtml(root)}</ul>`,
		);
	});

	it("renders empty list container when there are no children", () => {
		const empty = list(RichTextListFormat.Unordered, []);
		expect(renderRichTextListHtml(empty)).toBe("<ul></ul>");
		expect(renderRichTextListBodyHtml(empty)).toBe("");
	});
});
