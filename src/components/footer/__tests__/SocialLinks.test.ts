import { type Link, LinkTarget, ReferrerPolicy, SocialPlatform } from "@models";
import {
	createAstroContainer,
	createSocialLink,
	createTestLink,
	resetLinkIdCounter,
} from "@test/helpers";
import { afterEach, beforeAll, describe, expect, it } from "vitest";
import SocialLinks from "../SocialLinks.astro";

describe("SocialLinks.astro", () => {
	let container: Awaited<ReturnType<typeof createAstroContainer>>;

	beforeAll(async () => {
		container = await createAstroContainer();
	});

	afterEach(() => {
		resetLinkIdCounter();
	});

	async function render(links: Link[]) {
		return container.renderToString(SocialLinks, {
			props: { links },
		});
	}

	it("filters out links without platform property", async () => {
		const links = [
			createTestLink({ text: "No platform link" }),
			createSocialLink(SocialPlatform.GitHub, { text: "GitHub" }),
		];
		const html = await render(links);
		// Should only render the GitHub link
		expect(html).toContain("GitHub");
		// The non-platform link text should be in sr-only span if rendered
		// Actually, the filter removes it entirely, so we check there's only one link
		const linkMatches = html.match(/<a /g);
		expect(linkMatches).toHaveLength(1);
	});

	it("renders only links with platform property", async () => {
		const links = [
			createSocialLink(SocialPlatform.LinkedIn, { text: "LinkedIn" }),
			createSocialLink(SocialPlatform.GitHub, { text: "GitHub" }),
		];
		const html = await render(links);
		expect(html).toContain("LinkedIn");
		expect(html).toContain("GitHub");
		const linkMatches = html.match(/<a /g);
		expect(linkMatches).toHaveLength(2);
	});

	it("renders correct href for each link", async () => {
		const links = [
			createSocialLink(SocialPlatform.GitHub, {
				url: "https://github.com/user",
			}),
		];
		const html = await render(links);
		expect(html).toContain('href="https://github.com/user"');
	});

	it("applies target attribute from link props", async () => {
		const links = [
			createSocialLink(SocialPlatform.GitHub, { target: LinkTarget.Blank }),
		];
		const html = await render(links);
		expect(html).toContain('target="_blank"');
	});

	it('adds rel="noopener noreferrer" for _blank target', async () => {
		const links = [
			createSocialLink(SocialPlatform.GitHub, { target: LinkTarget.Blank }),
		];
		const html = await render(links);
		expect(html).toContain('rel="noopener noreferrer"');
	});

	it("does not add rel attribute for non-blank targets", async () => {
		const links = [
			createSocialLink(SocialPlatform.GitHub, { target: LinkTarget.Self }),
		];
		const html = await render(links);
		// Should not contain rel attribute at all (rel should be undefined)
		expect(html).not.toMatch(/rel="[^"]*"/);
	});

	it("applies referrerpolicy attribute from link props", async () => {
		const links = [
			createSocialLink(SocialPlatform.GitHub, {
				referrerPolicy: ReferrerPolicy.NoReferrer,
			}),
		];
		const html = await render(links);
		expect(html).toContain('referrerpolicy="no-referrer"');
	});

	it("renders link text in sr-only span for accessibility", async () => {
		const links = [
			createSocialLink(SocialPlatform.GitHub, { text: "Follow on GitHub" }),
		];
		const html = await render(links);
		expect(html).toContain('class="sr-only"');
		expect(html).toContain("Follow on GitHub");
	});

	it("renders SocialPlatformIcon for each platform", async () => {
		const links = [createSocialLink(SocialPlatform.GitHub)];
		const html = await render(links);
		// GitHub icon contains specific SVG path
		expect(html).toContain("<svg");
	});

	it("handles empty links array", async () => {
		const html = await render([]);
		// Should render nothing or just whitespace
		expect(html.replace(/\s/g, "")).toBe("");
	});

	it("handles all links without platform (renders nothing)", async () => {
		const links = [
			createTestLink({ text: "Regular link 1" }),
			createTestLink({ text: "Regular link 2" }),
		];
		const html = await render(links);
		expect(html.replace(/\s/g, "")).toBe("");
	});

	it("handles multiple social platforms", async () => {
		const links = [
			createSocialLink(SocialPlatform.GitHub, {
				url: "https://github.com/user",
			}),
			createSocialLink(SocialPlatform.LinkedIn, {
				url: "https://linkedin.com/in/user",
			}),
			createSocialLink(SocialPlatform.XTwitter, {
				url: "https://x.com/user",
			}),
		];
		const html = await render(links);
		expect(html).toContain("https://github.com/user");
		expect(html).toContain("https://linkedin.com/in/user");
		expect(html).toContain("https://x.com/user");
	});

	it("preserves order of social links", async () => {
		const links = [
			createSocialLink(SocialPlatform.GitHub, { text: "GitHub" }),
			createSocialLink(SocialPlatform.LinkedIn, { text: "LinkedIn" }),
			createSocialLink(SocialPlatform.XTwitter, { text: "X/Twitter" }),
		];
		const html = await render(links);

		const githubIndex = html.indexOf("GitHub");
		const linkedinIndex = html.indexOf("LinkedIn");
		const twitterIndex = html.indexOf("X/Twitter");

		expect(githubIndex).toBeLessThan(linkedinIndex);
		expect(linkedinIndex).toBeLessThan(twitterIndex);
	});

	it("mixes platform and non-platform links correctly", async () => {
		const links = [
			createTestLink({ text: "Normal link 1" }),
			createSocialLink(SocialPlatform.GitHub, { text: "GitHub" }),
			createTestLink({ text: "Normal link 2" }),
			createSocialLink(SocialPlatform.LinkedIn, { text: "LinkedIn" }),
		];
		const html = await render(links);

		// Only social links should be rendered
		const linkMatches = html.match(/<a /g);
		expect(linkMatches).toHaveLength(2);
		expect(html).toContain("GitHub");
		expect(html).toContain("LinkedIn");
	});
});
