import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { beforeAll, describe, expect, it } from "vitest";
import { SocialPlatform } from "../../../lib/content/models/link";
import SocialPlatformIcon from "../SocialPlatformIcon.astro";

function allSocialPlatforms(): SocialPlatform[] {
	return Object.values(SocialPlatform) as SocialPlatform[];
}

describe("SocialPlatformIcon.astro", () => {
	let container: Awaited<ReturnType<typeof AstroContainer.create>>;

	beforeAll(async () => {
		container = await AstroContainer.create();
	});

	it.each(
		allSocialPlatforms(),
	)("renders a 32×32 svg with path for %s", async (platform) => {
		const html = await container.renderToString(SocialPlatformIcon, {
			props: { platform },
		});
		expect(html).toContain('viewBox="0 0 24 24"');
		expect(html).toContain('width="32"');
		expect(html).toContain('height="32"');
		expect(html).toContain('aria-hidden="true"');
		expect(html).toContain('fill="currentColor"');
		expect(html).toMatch(/<path[^>]*d="M/);
	});

	it("uses the LinkedIn glyph when platform is LinkedIn", async () => {
		const html = await container.renderToString(SocialPlatformIcon, {
			props: { platform: SocialPlatform.LinkedIn },
		});
		expect(html).toContain("M20.447 20.452");
	});

	it("uses the GitHub glyph when platform is GitHub", async () => {
		const html = await container.renderToString(SocialPlatformIcon, {
			props: { platform: SocialPlatform.GitHub },
		});
		expect(html).toContain("M12 .297");
	});
});
