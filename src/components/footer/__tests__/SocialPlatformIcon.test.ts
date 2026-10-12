import { SocialPlatform } from "@models";
import { createAstroContainer } from "@test/helpers";
import { beforeAll, describe, expect, it } from "vitest";
import SocialPlatformIcon from "../SocialPlatformIcon.astro";

describe("SocialPlatformIcon.astro", () => {
	let container: Awaited<ReturnType<typeof createAstroContainer>>;

	beforeAll(async () => {
		container = await createAstroContainer();
	});

	async function render(platform: SocialPlatform) {
		return container.renderToString(SocialPlatformIcon, {
			props: { platform },
		});
	}

	it("renders SVG element for each platform", async () => {
		for (const platform of Object.values(SocialPlatform)) {
			const html = await render(platform as SocialPlatform);
			expect(html).toContain("<svg");
			expect(html).toContain("</svg>");
		}
	});

	it("renders GitHub icon with correct SVG path", async () => {
		const html = await render(SocialPlatform.GitHub);
		// GitHub icon contains characteristic path data
		expect(html).toContain("M12 .297");
	});

	it("renders LinkedIn icon with correct SVG path", async () => {
		const html = await render(SocialPlatform.LinkedIn);
		expect(html).toContain("<svg");
	});

	it("renders XTwitter icon with correct SVG path", async () => {
		const html = await render(SocialPlatform.XTwitter);
		expect(html).toContain("<svg");
	});

	it("renders YouTube icon with correct SVG path", async () => {
		const html = await render(SocialPlatform.YouTube);
		expect(html).toContain("<svg");
	});

	it("renders Facebook icon with correct SVG path", async () => {
		const html = await render(SocialPlatform.Facebook);
		expect(html).toContain("<svg");
	});

	it("renders Instagram icon with correct SVG path", async () => {
		const html = await render(SocialPlatform.Instagram);
		expect(html).toContain("<svg");
	});

	it("renders TikTok icon with correct SVG path", async () => {
		const html = await render(SocialPlatform.TikTok);
		expect(html).toContain("<svg");
	});

	it("renders Telegram icon with correct SVG path", async () => {
		const html = await render(SocialPlatform.Telegram);
		expect(html).toContain("<svg");
	});

	it("renders Discord icon with correct SVG path", async () => {
		const html = await render(SocialPlatform.Discord);
		expect(html).toContain("<svg");
	});

	it("renders Reddit icon with correct SVG path", async () => {
		const html = await render(SocialPlatform.Reddit);
		expect(html).toContain("<svg");
	});

	it("renders Pinterest icon with correct SVG path", async () => {
		const html = await render(SocialPlatform.Pinterest);
		expect(html).toContain("<svg");
	});

	it("renders WhatsApp icon with correct SVG path", async () => {
		const html = await render(SocialPlatform.WhatsApp);
		expect(html).toContain("<svg");
	});

	it("renders Medium icon with correct SVG path", async () => {
		const html = await render(SocialPlatform.Medium);
		expect(html).toContain("<svg");
	});

	it("sets viewBox attribute on SVG", async () => {
		const html = await render(SocialPlatform.GitHub);
		expect(html).toContain('viewBox="0 0 24 24"');
	});

	it("sets standard size attributes", async () => {
		const html = await render(SocialPlatform.GitHub);
		expect(html).toContain('width="32"');
		expect(html).toContain('height="32"');
	});

	it("sets fill attribute to currentColor", async () => {
		const html = await render(SocialPlatform.GitHub);
		expect(html).toContain('fill="currentColor"');
	});

	it("includes aria-hidden for decorative icons", async () => {
		const html = await render(SocialPlatform.GitHub);
		expect(html).toContain('aria-hidden="true"');
	});

	it("renders consistent SVG structure across platforms", async () => {
		// All platforms should have similar SVG structure
		for (const platform of Object.values(SocialPlatform)) {
			const html = await render(platform as SocialPlatform);
			expect(html).toContain("<svg");
			expect(html).toContain("<path");
			expect(html).toContain("</svg>");
		}
	});
});
