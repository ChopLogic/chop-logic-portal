import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { beforeAll, describe, expect, it } from "vitest";
import {
	type Link,
	LinkTarget,
	LinkType,
	ReferrerPolicy,
	SocialPlatform,
} from "../../../lib/content/models/link";
import {
	type RichTextContent,
	RichTextContentType,
} from "../../../lib/content/models/rich-text-block";
import Footer from "../Footer.astro";

function emptyRichText(): RichTextContent {
	return [];
}

function singleParagraphRichText(): RichTextContent {
	return [
		{
			type: RichTextContentType.Paragraph,
			children: [
				{
					type: RichTextContentType.Text,
					text: "Footer copy",
				},
			],
		},
	];
}

function testLink(overrides: Partial<Link>): Link {
	return {
		id: "1",
		url: overrides.url as string,
		text: overrides.text as string,
		target: overrides.target ?? LinkTarget.Blank,
		type: overrides.type ?? LinkType.External,
		referrerpolicy:
			overrides.referrerpolicy ?? ReferrerPolicy.StrictOriginWhenCrossOrigin,
		...overrides,
	};
}

describe("Footer.astro", () => {
	let container: Awaited<ReturnType<typeof AstroContainer.create>>;

	beforeAll(async () => {
		container = await AstroContainer.create();
	});

	it("renders a footer with rich text content", async () => {
		const html = await container.renderToString(Footer, {
			props: {
				content: singleParagraphRichText(),
				links: [],
			},
		});
		expect(html).toContain("<footer");
		expect(html).toContain("Footer copy");
	});

	it("does not render the social-links block when no link has a platform", async () => {
		const html = await container.renderToString(Footer, {
			props: {
				content: emptyRichText(),
				links: [testLink({ url: "https://x.com", text: "No platform" })],
			},
		});
		expect(html).not.toContain('class="social-links"');
	});

	it("renders the social-links block when at least one link has a platform", async () => {
		const html = await container.renderToString(Footer, {
			props: {
				content: emptyRichText(),
				links: [
					testLink({
						url: "https://github.com/u",
						text: "GH",
						platform: SocialPlatform.GitHub,
					}),
				],
			},
		});
		expect(html).toContain('class="social-links"');
		expect(html).toContain("M12 .297");
	});
});
