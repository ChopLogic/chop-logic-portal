import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { beforeAll, describe, expect, it } from "vitest";
import {
	type Link,
	LinkTarget,
	LinkType,
	ReferrerPolicy,
	SocialPlatform,
} from "../../../lib/content/models/link";
import SocialLinks from "../SocialLinks.astro";

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

describe("SocialLinks.astro", () => {
	let container: Awaited<ReturnType<typeof AstroContainer.create>>;

	beforeAll(async () => {
		container = await AstroContainer.create();
	});

	it("renders nothing when links is empty", async () => {
		const html = await container.renderToString(SocialLinks, {
			props: { links: [] },
		});
		expect(html).not.toContain("<a ");
	});

	it("skips links without a platform", async () => {
		const html = await container.renderToString(SocialLinks, {
			props: {
				links: [testLink({ url: "https://a.com", text: "A" })],
			},
		});
		expect(html).not.toContain("<a ");
	});

	it("renders an anchor with href, screen-reader text, and icon for a social link", async () => {
		const html = await container.renderToString(SocialLinks, {
			props: {
				links: [
					testLink({
						url: "https://github.com/user",
						text: "My GitHub",
						platform: SocialPlatform.GitHub,
					}),
				],
			},
		});
		expect(html).toContain('href="https://github.com/user"');
		expect(html).toContain('class="sr-only"');
		expect(html).toContain("My GitHub");
		expect(html).toContain("M12 .297");
	});

	it("adds rel=noopener noreferrer for target _blank", async () => {
		const html = await container.renderToString(SocialLinks, {
			props: {
				links: [
					testLink({
						url: "https://x.com/h",
						text: "X",
						target: LinkTarget.Blank,
						platform: SocialPlatform.XTwitter,
					}),
				],
			},
		});
		expect(html).toContain('target="_blank"');
		expect(html).toMatch(/rel="noopener noreferrer"/);
	});

	it("omits rel when target is not _blank", async () => {
		const html = await container.renderToString(SocialLinks, {
			props: {
				links: [
					testLink({
						url: "https://example.com",
						text: "Same tab",
						target: LinkTarget.Self,
						platform: SocialPlatform.Medium,
					}),
				],
			},
		});
		expect(html).toContain('target="_self"');
		expect(html).not.toMatch(/rel="noopener/);
	});

	it("passes referrerpolicy to the anchor", async () => {
		const html = await container.renderToString(SocialLinks, {
			props: {
				links: [
					testLink({
						url: "https://example.com",
						text: "Test",
						referrerpolicy: ReferrerPolicy.NoReferrer,
						platform: SocialPlatform.Discord,
					}),
				],
			},
		});
		expect(html).toContain('referrerpolicy="no-referrer"');
	});

	it("renders multiple social links in order", async () => {
		const html = await container.renderToString(SocialLinks, {
			props: {
				links: [
					testLink({
						id: "a",
						url: "https://a.com",
						text: "First",
						platform: SocialPlatform.GitHub,
					}),
					testLink({
						id: "b",
						url: "https://b.com",
						text: "Second",
						platform: SocialPlatform.LinkedIn,
					}),
				],
			},
		});
		const iFirst = html.indexOf("https://a.com");
		const iSecond = html.indexOf("https://b.com");
		expect(iFirst).toBeGreaterThanOrEqual(0);
		expect(iSecond).toBeGreaterThan(iFirst);
	});
});
