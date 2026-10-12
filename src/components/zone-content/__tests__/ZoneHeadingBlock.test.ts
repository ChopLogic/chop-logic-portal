import { createAstroContainer } from "@test/helpers";
import { beforeAll, describe, expect, it } from "vitest";
import ZoneHeadingBlock from "../ZoneHeadingBlock.astro";

describe("ZoneHeadingBlock.astro", () => {
	let container: Awaited<ReturnType<typeof createAstroContainer>>;

	beforeAll(async () => {
		container = await createAstroContainer();
	});

	async function render(
		heading: string,
		subHeading?: string,
		className?: string,
	) {
		return container.renderToString(ZoneHeadingBlock, {
			props: { heading, subHeading, className },
		});
	}

	it("renders a container div", async () => {
		const html = await render("Heading");
		expect(html).toContain("<div");
		expect(html).toContain("</div>");
	});

	it("renders h2 element with heading text", async () => {
		const html = await render("Main Section Heading");
		expect(html).toContain("<h2");
		expect(html).toContain("Main Section Heading");
		expect(html).toContain("</h2>");
	});

	it("renders subheading paragraph when subHeading is provided", async () => {
		const html = await render("Title", "This is the subtitle");
		expect(html).toContain("<p");
		expect(html).toContain("This is the subtitle");
		expect(html).toContain("</p>");
	});

	it("applies zone-sub-heading class to subtitle paragraph", async () => {
		const html = await render("Title", "Subtitle");
		expect(html).toContain('class="zone-sub-heading"');
	});

	it("does not render paragraph when subHeading is not provided", async () => {
		const html = await render("Only Heading");
		expect(html).not.toContain("<p");
		expect(html).not.toContain("zone-sub-heading");
	});

	it("does not render paragraph when subHeading is undefined", async () => {
		const html = await render("Only Heading", undefined);
		expect(html).not.toContain("<p");
	});

	it("does not render paragraph when subHeading is empty string", async () => {
		const html = await render("Only Heading", "");
		// Empty string is falsy, so paragraph should not render
		expect(html).not.toContain("zone-sub-heading");
	});

	it("applies optional className to container div", async () => {
		const html = await render("Title", undefined, "custom-class");
		expect(html).toContain('class="custom-class"');
	});

	it("does not add class attribute when className is not provided", async () => {
		const html = await render("Title");
		// The div should not have an empty class attribute
		// Check the pattern for <div> or <div class="">
		const divMatch = html.match(/<div[^>]*>/);
		expect(divMatch?.[0]).not.toContain('class=""');
	});

	it("escapes HTML in heading to prevent XSS", async () => {
		const html = await render("<script>alert('xss')</script>");
		expect(html).toContain("&lt;script&gt;");
		expect(html).not.toContain("<script>alert");
	});

	it("escapes HTML in subHeading to prevent XSS", async () => {
		const html = await render("Safe Title", "<img onerror='alert(1)'>");
		expect(html).toContain("&lt;img onerror");
		expect(html).not.toContain("<img onerror");
	});

	it("handles special characters in heading", async () => {
		const html = await render("Title with & and < symbols");
		expect(html).toContain("&amp;");
		expect(html).toContain("&lt;");
	});

	it("handles special characters in subHeading", async () => {
		const html = await render("Title", "Subtitle with & and < symbols");
		expect(html).toContain("&amp;");
		expect(html).toContain("&lt;");
	});

	it("handles unicode characters", async () => {
		const html = await render("日本語タイトル 🎉", "Подзаголовок");
		expect(html).toContain("日本語タイトル 🎉");
		expect(html).toContain("Подзаголовок");
	});

	it("handles long heading text", async () => {
		const longHeading =
			"This is a very long heading that might wrap to multiple lines in the rendered output";
		const html = await render(longHeading);
		expect(html).toContain(longHeading);
	});

	it("handles both heading and subHeading together", async () => {
		const html = await render("Main Title", "Supporting subtitle text");
		expect(html).toContain("Main Title");
		expect(html).toContain("Supporting subtitle text");
		// Check order - h2 should come before p
		const h2Index = html.indexOf("<h2>");
		const pIndex = html.indexOf("<p");
		expect(h2Index).toBeLessThan(pIndex);
	});

	it("applies className along with heading and subheading", async () => {
		const html = await render(
			"Full Title",
			"Full Subtitle",
			"zone-heading-custom",
		);
		expect(html).toContain('class="zone-heading-custom"');
		expect(html).toContain("Full Title");
		expect(html).toContain("Full Subtitle");
	});
});
