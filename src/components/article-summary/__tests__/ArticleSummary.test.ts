import type { RichTextContent, Tag } from "@models";
import {
	createAstroContainer,
	createRichTextContent,
	createSimpleParagraph,
	createTag,
	createTags,
} from "@test/helpers";
import { beforeAll, describe, expect, it } from "vitest";
import ArticleSummary from "../ArticleSummary.astro";

describe("ArticleSummary.astro", () => {
	let container: Awaited<ReturnType<typeof createAstroContainer>>;

	beforeAll(async () => {
		container = await createAstroContainer();
	});

	async function render(content: RichTextContent, tags: Tag[]) {
		return container.renderToString(ArticleSummary, {
			props: { content, tags },
		});
	}

	it("renders a container div with article-summary class", async () => {
		const html = await render(createRichTextContent(), [createTag()]);
		expect(html).toContain('<div class="article-summary"');
		expect(html).toContain("</div>");
	});

	it("renders rich text content through RichTextBlockContent", async () => {
		const content = createRichTextContent("This is the article summary.");
		const html = await render(content, [createTag()]);
		expect(html).toContain("This is the article summary.");
	});

	it("renders keywords section with tag names", async () => {
		const tags = createTags(["JavaScript", "TypeScript", "React"]);
		const html = await render(createRichTextContent(), tags);
		expect(html).toContain("Keywords:");
		expect(html).toContain("JavaScript");
		expect(html).toContain("TypeScript");
		expect(html).toContain("React");
	});

	it("joins multiple tag names with commas", async () => {
		const tags = createTags(["One", "Two", "Three"]);
		const html = await render(createRichTextContent(), tags);
		expect(html).toContain("One, Two, Three");
	});

	it("handles single tag", async () => {
		const tags = createTags(["SingleTag"]);
		const html = await render(createRichTextContent(), tags);
		expect(html).toContain("SingleTag");
		expect(html).not.toContain(",");
	});

	it("handles empty tags array", async () => {
		const html = await render(createRichTextContent(), []);
		expect(html).toContain("Keywords:");
		// Should have empty keywords after the label
		expect(html).toContain("<strong");
		expect(html).toContain("Keywords:");
	});

	it("renders keywords paragraph with article-summary__keywords class", async () => {
		const html = await render(createRichTextContent(), [createTag()]);
		expect(html).toContain('class="article-summary__keywords"');
	});

	it("renders Keywords label in bold", async () => {
		const html = await render(createRichTextContent(), [createTag()]);
		expect(html).toContain("<strong");
		expect(html).toContain("Keywords:");
		expect(html).toContain("</strong>");
	});

	it("escapes HTML in tag names to prevent XSS", async () => {
		const tags = [createTag({ name: "<script>alert('xss')</script>" })];
		const html = await render(createRichTextContent(), tags);
		expect(html).toContain("&lt;script&gt;");
		expect(html).not.toContain("<script>alert");
	});

	it("handles tags with special characters", async () => {
		const tags = createTags(["C++", "C#", "Node.js", "ASP.NET"]);
		const html = await render(createRichTextContent(), tags);
		expect(html).toContain("C++");
		expect(html).toContain("C#");
		expect(html).toContain("Node.js");
		expect(html).toContain("ASP.NET");
	});

	it("handles empty content array", async () => {
		const html = await render([], [createTag()]);
		expect(html).toContain("article-summary");
		// Should still render keywords
		expect(html).toContain("Keywords:");
	});

	it("handles complex rich text content", async () => {
		const content: RichTextContent = [
			createSimpleParagraph("First paragraph of the summary."),
			createSimpleParagraph("Second paragraph with more details."),
		];
		const html = await render(content, createTags(["Test"]));
		expect(html).toContain("First paragraph of the summary.");
		expect(html).toContain("Second paragraph with more details.");
	});

	it("handles tags with unicode characters", async () => {
		const tags = createTags(["日本語", "Émoji 🎉", "Ключевое слово"]);
		const html = await render(createRichTextContent(), tags);
		expect(html).toContain("日本語");
		expect(html).toContain("Émoji 🎉");
		expect(html).toContain("Ключевое слово");
	});

	it("preserves order of tags", async () => {
		const tags = createTags(["First", "Second", "Third"]);
		const html = await render(createRichTextContent(), tags);
		const firstIndex = html.indexOf("First");
		const secondIndex = html.indexOf("Second");
		const thirdIndex = html.indexOf("Third");
		expect(firstIndex).toBeLessThan(secondIndex);
		expect(secondIndex).toBeLessThan(thirdIndex);
	});
});
