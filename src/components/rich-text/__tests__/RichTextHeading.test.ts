import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { beforeAll, describe, expect, it } from "vitest";
import {
	RichTextContentType,
	type RichTextHeading as RichTextHeadingModel,
	type RichTextNode,
} from "../../../lib/content/models/rich-text-block";
import { renderRichTextNodeHtml } from "../helpers";
import RichTextHeading from "../RichTextHeading.astro";

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

describe("RichTextHeading.astro", () => {
	let container: Awaited<ReturnType<typeof AstroContainer.create>>;

	beforeAll(async () => {
		container = await AstroContainer.create();
	});

	async function render(model: RichTextHeadingModel) {
		return container.renderToString(RichTextHeading, {
			props: { heading: model },
		});
	}

	it("renders h1-h6 according to level with inner HTML from children", async () => {
		for (let level = 1; level <= 6; level++) {
			const html = await render({
				type: RichTextContentType.Heading,
				level,
				children: [textNode("Section")],
			});
			expect(html).toContain(`<h${level}`);
			expect(html).toContain(`</h${level}>`);
			expect(html).toContain("Section");
		}
	});

	it("defaults to h2 when level is out of range (0 or > 6)", async () => {
		const low = await render({
			type: RichTextContentType.Heading,
			level: 0,
			children: [textNode("A")],
		});
		expect(low).toContain("<h2");
		expect(low).not.toContain("<h1");

		const high = await render({
			type: RichTextContentType.Heading,
			level: 10,
			children: [textNode("B")],
		});
		expect(high).toContain("<h2");
		expect(high).not.toContain("<h10");
	});

	it("defaults to h2 when level is not finite", async () => {
		const nan = await render({
			type: RichTextContentType.Heading,
			level: Number.NaN,
			children: [textNode("x")],
		});
		expect(nan).toContain("<h2");

		const inf = await render({
			type: RichTextContentType.Heading,
			level: Number.POSITIVE_INFINITY,
			children: [textNode("y")],
		});
		expect(inf).toContain("<h2");
	});

	it("truncates fractional levels toward zero", async () => {
		const html = await render({
			type: RichTextContentType.Heading,
			level: 3.99,
			children: [textNode("Rounded")],
		});
		expect(html).toContain("<h3");
		expect(html).not.toContain("<h4");
	});

	it("pipes children through renderRichTextNodeHtml (formatting preserved)", async () => {
		const children = [textNode("Important", { bold: true })];
		const html = await render({
			type: RichTextContentType.Heading,
			level: 2,
			children,
		});
		const expectedInner = children.map(renderRichTextNodeHtml).join("");
		expect(html).toContain(expectedInner);
		expect(html).toContain("<strong>Important</strong>");
	});

	it("concatenates multiple text runs", async () => {
		const html = await render({
			type: RichTextContentType.Heading,
			level: 4,
			children: [textNode("One"), textNode("Two", { italic: true })],
		});
		expect(html).toContain("One");
		expect(html).toContain("<em>Two</em>");
	});

	it("escapes dangerous text via helpers (no raw angle brackets from content)", async () => {
		const html = await render({
			type: RichTextContentType.Heading,
			level: 2,
			children: [textNode("<script>")],
		});
		expect(html).toContain("&lt;script&gt;");
		expect(html).not.toContain("<script>");
	});
});
