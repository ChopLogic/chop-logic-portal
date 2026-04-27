import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { beforeAll, describe, expect, it } from "vitest";
import {
	RichTextContentType,
	type RichTextLink,
	RichTextListFormat,
	type RichTextListItem,
	type RichTextList as RichTextListModel,
	type RichTextNode,
} from "../../../lib/content/models/rich-text-block";
import { renderRichTextListBodyHtml, renderRichTextListHtml } from "../helpers";
import RichTextList from "../RichTextList.astro";

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
	children: RichTextListModel["children"],
	indentLevel?: number,
): RichTextListModel {
	return {
		type: RichTextContentType.List,
		format,
		children,
		...(indentLevel !== undefined ? { indentLevel } : {}),
	};
}

describe("RichTextList.astro", () => {
	let container: Awaited<ReturnType<typeof AstroContainer.create>>;

	beforeAll(async () => {
		container = await AstroContainer.create();
	});

	async function render(model: RichTextListModel) {
		return container.renderToString(RichTextList, {
			props: { list: model },
		});
	}

	it("renders ul for unordered and ol for ordered format", async () => {
		const ulModel = list(RichTextListFormat.Unordered, [
			listItem([textNode("one")]),
		]);
		const ulHtml = await render(ulModel);
		expect(ulHtml).toContain("<ul");
		expect(ulHtml).toContain("</ul>");
		expect(ulHtml).not.toContain("<ol");

		const olModel = list(RichTextListFormat.Ordered, [
			listItem([textNode("two")]),
		]);
		const olHtml = await render(olModel);
		expect(olHtml).toContain("<ol");
		expect(olHtml).toContain("</ol>");
		expect(olHtml).not.toContain("<ul");
	});

	it("pipes body HTML through renderRichTextListBodyHtml", async () => {
		const model = list(RichTextListFormat.Unordered, [
			listItem([textNode("a"), link({ url: "/x", children: [textNode("b")] })]),
			listItem([textNode("c", { italic: true })]),
		]);
		const html = await render(model);
		const expectedBody = renderRichTextListBodyHtml(model);
		expect(html).toContain(expectedBody);
		expect(html).toContain('<a href="/x">b</a>');
		expect(html).toContain("<em>c</em>");
	});

	it("matches full helper list markup aside from optional indent attribute", async () => {
		const model = list(RichTextListFormat.Ordered, [
			listItem([textNode("item")]),
		]);
		const html = await render(model);
		const expectedFromHelpers = renderRichTextListHtml(model);
		expect(html).toContain(expectedFromHelpers);
	});

	it("merges trailing nested lists into the preceding li (Strapi shape)", async () => {
		const nested = list(RichTextListFormat.Unordered, [
			listItem([textNode("nested")]),
		]);
		const root = list(RichTextListFormat.Ordered, [
			listItem([textNode("outer")]),
			nested,
		]);
		const html = await render(root);
		expect(html).toContain("<ol");
		expect(html).toContain("<li>outer<ul><li>nested</li></ul></li>");
	});

	it("adds data-indent-level only for finite numeric indentLevel", async () => {
		const withIndent = await render(
			list(RichTextListFormat.Unordered, [listItem([textNode("x")])], 2),
		);
		expect(withIndent).toContain('data-indent-level="2"');

		const nan = await render(
			list(
				RichTextListFormat.Unordered,
				[listItem([textNode("y")])],
				Number.NaN,
			),
		);
		expect(nan).not.toContain("data-indent-level");

		const inf = await render(
			list(
				RichTextListFormat.Unordered,
				[listItem([textNode("z")])],
				Number.POSITIVE_INFINITY,
			),
		);
		expect(inf).not.toContain("data-indent-level");

		const omit = await render(
			list(RichTextListFormat.Unordered, [listItem([textNode("w")])]),
		);
		expect(omit).not.toContain("data-indent-level");
	});

	it("renders empty list container when there are no items", async () => {
		const html = await render(list(RichTextListFormat.Unordered, []));
		expect(html).toContain("<ul");
		expect(html).toContain("</ul>");
		expect(
			renderRichTextListBodyHtml(list(RichTextListFormat.Unordered, [])),
		).toBe("");
	});
});
