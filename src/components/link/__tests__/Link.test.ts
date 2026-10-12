import { LinkTarget, LinkType, ReferrerPolicy } from "@models";
import {
	createAstroContainer,
	createInternalLink,
	createTestLink,
} from "@test/helpers";
import { beforeAll, describe, expect, it } from "vitest";
import Link from "../Link.astro";

describe("Link.astro", () => {
	let container: Awaited<ReturnType<typeof createAstroContainer>>;

	beforeAll(async () => {
		container = await createAstroContainer();
	});

	async function render(
		link: Parameters<typeof Link>[0]["link"],
		options: { className?: string; slot?: string } = {},
	) {
		return container.renderToString(Link, {
			props: { link, className: options.className },
			slots: { default: options.slot ?? "Link Text" },
		});
	}

	it("renders an anchor element with correct href", async () => {
		const link = createTestLink({ url: "https://example.com/page" });
		const html = await render(link);
		expect(html).toContain('<a href="https://example.com/page"');
	});

	it("renders slot content inside the anchor", async () => {
		const link = createTestLink();
		const html = await render(link, { slot: "Click me!" });
		expect(html).toContain("Click me!");
		expect(html).toContain("</a>");
	});

	it("applies target attribute from link props", async () => {
		const blankLink = createTestLink({ target: LinkTarget.Blank });
		const selfLink = createTestLink({ target: LinkTarget.Self });
		const parentLink = createTestLink({ target: LinkTarget.Parent });
		const topLink = createTestLink({ target: LinkTarget.Top });

		const blankHtml = await render(blankLink);
		const selfHtml = await render(selfLink);
		const parentHtml = await render(parentLink);
		const topHtml = await render(topLink);

		expect(blankHtml).toContain('target="_blank"');
		expect(selfHtml).toContain('target="_self"');
		expect(parentHtml).toContain('target="_parent"');
		expect(topHtml).toContain('target="_top"');
	});

	it("applies rel attribute from link props", async () => {
		const link = createTestLink({ rel: "noopener noreferrer" });
		const html = await render(link);
		expect(html).toContain('rel="noopener noreferrer"');
	});

	it("applies referrerpolicy attribute from link props", async () => {
		const noReferrer = createTestLink({
			referrerPolicy: ReferrerPolicy.NoReferrer,
		});
		const strictOrigin = createTestLink({
			referrerPolicy: ReferrerPolicy.StrictOriginWhenCrossOrigin,
		});

		const noReferrerHtml = await render(noReferrer);
		const strictOriginHtml = await render(strictOrigin);

		expect(noReferrerHtml).toContain('referrerpolicy="no-referrer"');
		expect(strictOriginHtml).toContain(
			'referrerpolicy="strict-origin-when-cross-origin"',
		);
	});

	it("applies optional className to the anchor", async () => {
		const link = createTestLink();
		const html = await render(link, { className: "custom-link-class" });
		expect(html).toContain('class="custom-link-class"');
	});

	it("does not add class attribute when className is not provided", async () => {
		const link = createTestLink();
		const html = await render(link);
		// Should not have an empty class attribute
		expect(html).not.toContain('class=""');
	});

	it("handles internal links correctly", async () => {
		const link = createInternalLink({
			url: "/about",
			text: "About page",
		});
		const html = await render(link);
		expect(html).toContain('href="/about"');
		expect(html).toContain('target="_self"');
	});

	it("handles external links with all security attributes", async () => {
		const link = createTestLink({
			url: "https://external-site.com",
			target: LinkTarget.Blank,
			type: LinkType.External,
			rel: "noopener noreferrer nofollow",
			referrerPolicy: ReferrerPolicy.NoReferrer,
		});
		const html = await render(link);
		expect(html).toContain('href="https://external-site.com"');
		expect(html).toContain('target="_blank"');
		expect(html).toContain('rel="noopener noreferrer nofollow"');
		expect(html).toContain('referrerpolicy="no-referrer"');
	});

	it("renders complex slot content", async () => {
		const link = createTestLink();
		const html = await render(link, {
			slot: '<span class="icon">→</span> Read more',
		});
		expect(html).toContain('<span class="icon">→</span> Read more');
	});
});
