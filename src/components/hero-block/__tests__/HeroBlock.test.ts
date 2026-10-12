import { createAstroContainer } from "@test/helpers";
import { beforeAll, describe, expect, it } from "vitest";
import HeroBlock from "../HeroBlock.astro";

describe("HeroBlock.astro", () => {
	let container: Awaited<ReturnType<typeof createAstroContainer>>;

	beforeAll(async () => {
		container = await createAstroContainer();
	});

	async function render(title: string, subTitle?: string) {
		return container.renderToString(HeroBlock, {
			props: { title, subTitle },
		});
	}

	it("renders a container div with hero-block class", async () => {
		const html = await render("Test Title");
		expect(html).toContain('<div class="hero-block"');
		expect(html).toContain("</div>");
	});

	it("renders an h1 element with the title", async () => {
		const html = await render("Welcome to My Blog");
		expect(html).toContain("<h1");
		expect(html).toContain("Welcome to My Blog");
		expect(html).toContain("</h1>");
	});

	it("applies hero-block__title class to h1", async () => {
		const html = await render("Title");
		expect(html).toContain('class="hero-block__title"');
	});

	it("renders subtitle paragraph when subTitle is provided", async () => {
		const html = await render("Main Title", "This is a subtitle");
		expect(html).toContain("<p");
		expect(html).toContain("This is a subtitle");
		expect(html).toContain("</p>");
	});

	it("applies hero-block__sub-title class to subtitle paragraph", async () => {
		const html = await render("Title", "Subtitle");
		expect(html).toContain('class="hero-block__sub-title"');
	});

	it("does not render subtitle paragraph when subTitle is not provided", async () => {
		const html = await render("Only Title");
		expect(html).not.toContain("hero-block__sub-title");
		expect(html).not.toContain("<p");
	});

	it("does not render subtitle paragraph when subTitle is undefined", async () => {
		const html = await render("Only Title", undefined);
		expect(html).not.toContain("hero-block__sub-title");
	});

	it("handles empty string title", async () => {
		const html = await render("");
		expect(html).toContain("<h1");
		expect(html).toContain("</h1>");
	});

	it("handles empty string subtitle (should not render paragraph)", async () => {
		const html = await render("Title", "");
		// Empty string is falsy, so paragraph should not render
		expect(html).not.toContain("hero-block__sub-title");
	});

	it("escapes HTML in title to prevent XSS", async () => {
		const html = await render("<script>alert('xss')</script>");
		expect(html).toContain("&lt;script&gt;");
		expect(html).not.toContain("<script>alert");
	});

	it("escapes HTML in subtitle to prevent XSS", async () => {
		const html = await render("Safe Title", "<img onerror='alert(1)' src='x'>");
		expect(html).toContain("&lt;img onerror");
		expect(html).not.toContain("<img onerror");
	});

	it("handles special characters in title", async () => {
		const html = await render("Title with & ampersand and < bracket");
		expect(html).toContain("&amp;");
		expect(html).toContain("&lt;");
	});

	it("handles long title text", async () => {
		const longTitle =
			"This is a very long title that might wrap to multiple lines in the UI but should still render correctly";
		const html = await render(longTitle);
		expect(html).toContain(longTitle);
	});

	it("handles unicode characters in title and subtitle", async () => {
		const html = await render(
			"Приветствие 🎉",
			"日本語サブタイトル with émojis 🚀",
		);
		expect(html).toContain("Приветствие 🎉");
		expect(html).toContain("日本語サブタイトル with émojis 🚀");
	});
});
