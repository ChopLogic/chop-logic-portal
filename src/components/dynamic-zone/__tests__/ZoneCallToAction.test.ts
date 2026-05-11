import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { beforeAll, describe, expect, it } from "vitest";
import {
	type DynamicZoneCallToAction,
	DynamicZoneComponentType,
} from "../../../lib/content/models/dynamic-zone";
import type { CmsImage } from "../../../lib/content/models/image";
import {
	type Link,
	LinkTarget,
	LinkType,
	ReferrerPolicy,
	SocialPlatform,
} from "../../../lib/content/models/link";
import { CMS_PICTURE_SIZES } from "../cms-picture";
import ZoneCallToAction from "../ZoneCallToAction.astro";

function testLink(overrides: Partial<Link> = {}): Link {
	return {
		id: "link-1",
		url: "https://github.com/example",
		text: "View on GitHub",
		target: LinkTarget.Blank,
		type: LinkType.External,
		referrerpolicy: ReferrerPolicy.StrictOriginWhenCrossOrigin,
		platform: SocialPlatform.GitHub,
		...overrides,
	};
}

function testCmsImage(): CmsImage {
	return {
		documentId: "img-1",
		name: "logo.png",
		url: "https://cms.example.com/uploads/logo.png",
		width: 612,
		height: 306,
		alternativeText: "Logo",
		formats: {
			small: {
				url: "https://cms.example.com/uploads/small_logo.png",
				width: 500,
				height: 250,
			},
		},
	};
}

function testCallToAction(
	overrides: Partial<DynamicZoneCallToAction> = {},
): DynamicZoneCallToAction {
	return {
		type: DynamicZoneComponentType.CallToAction,
		id: "cta-1",
		heading: "Get involved",
		subHeading: "Join the project",
		link: testLink(),
		...overrides,
	};
}

describe("ZoneCallToAction.astro", () => {
	let container: Awaited<ReturnType<typeof AstroContainer.create>>;

	beforeAll(async () => {
		container = await AstroContainer.create();
	});

	async function render(callToAction: DynamicZoneCallToAction) {
		return container.renderToString(ZoneCallToAction, {
			props: { callToAction },
		});
	}

	it("renders heading, subheading, and link card", async () => {
		const html = await render(testCallToAction({ picture: testCmsImage() }));
		expect(html).toContain("zone-cta--with-media");
		expect(html).toContain('<section class="zone-cta');
		expect(html).toContain("Get involved");
		expect(html).toContain("Join the project");
		expect(html).toContain('href="https://github.com/example"');
		expect(html).toContain("View on GitHub");
		expect(html).toContain('target="_blank"');
		expect(html).toContain('rel="noopener noreferrer"');
	});

	it("renders without media modifier when picture is omitted", async () => {
		const html = await render(testCallToAction({ picture: undefined }));
		expect(html).toContain('<section class="zone-cta"');
		expect(html).not.toContain("zone-cta--with-media");
		expect(html).not.toContain("<picture");
	});

	it("renders optional picture with CTA sizes", async () => {
		const html = await render(testCallToAction({ picture: testCmsImage() }));
		expect(html).toContain("<picture");
		expect(html).toContain('alt="Logo"');
		expect(html).toContain(`sizes="${CMS_PICTURE_SIZES.cta}"`);
	});

	it("shows external arrow for external links and internal arrow otherwise", async () => {
		const external = await render(testCallToAction());
		expect(external).toContain("↗");

		const internal = await render(
			testCallToAction({
				link: testLink({ type: LinkType.Internal, url: "/about" }),
			}),
		);
		expect(internal).toContain('href="/about"');
		expect(internal).toContain("→");
		expect(internal).not.toContain("↗");
	});

	it("renders platform icon when link has a platform", async () => {
		const html = await render(testCallToAction());
		expect(html).toContain("zone-cta-icon");
		expect(html).toContain("M12 .297");
	});

	it("omits h3 when subHeading is not set", async () => {
		const html = await render(testCallToAction({ subHeading: undefined }));
		expect(html).not.toContain("<h3");
	});

	it("escapes dangerous characters in headings and link text", async () => {
		const html = await render(
			testCallToAction({
				heading: "<script>",
				subHeading: "<img onerror>",
				link: testLink({ text: "<evil>" }),
			}),
		);
		expect(html).toContain("&lt;script&gt;");
		expect(html).toContain("&lt;img onerror&gt;");
		expect(html).toContain("&lt;evil&gt;");
		expect(html).not.toContain("<script>");
	});
});
