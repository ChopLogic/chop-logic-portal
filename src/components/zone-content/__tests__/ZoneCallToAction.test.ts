import type { DynamicZoneCallToAction } from "@models";
import {
	createAstroContainerWithReact,
	createImageProps,
	createTestLink,
	createZoneCallToAction,
	resetLinkIdCounter,
	resetZoneIdCounter,
} from "@test/helpers";
import { afterEach, beforeAll, describe, expect, it } from "vitest";
import ZoneCallToAction from "../ZoneCallToAction.astro";

describe("ZoneCallToAction.astro", () => {
	let container: Awaited<ReturnType<typeof createAstroContainerWithReact>>;

	beforeAll(async () => {
		container = await createAstroContainerWithReact();
	});

	afterEach(() => {
		resetZoneIdCounter();
		resetLinkIdCounter();
	});

	async function render(callToAction: DynamicZoneCallToAction) {
		return container.renderToString(ZoneCallToAction, {
			props: { callToAction },
		});
	}

	it("renders a section element with zone-cta class", async () => {
		const html = await render(createZoneCallToAction());
		expect(html).toContain("<section");
		expect(html).toContain("zone-cta");
		expect(html).toContain("</section>");
	});

	it("renders heading through ZoneHeadingBlock", async () => {
		const html = await render(
			createZoneCallToAction({ heading: "Get Started Today" }),
		);
		expect(html).toContain("<h2");
		expect(html).toContain("Get Started Today");
	});

	it("renders subHeading through ZoneHeadingBlock when provided", async () => {
		const html = await render(
			createZoneCallToAction({
				heading: "Main CTA",
				subHeading: "Supporting text for the CTA",
			}),
		);
		expect(html).toContain("Supporting text for the CTA");
	});

	it("renders link button with link text", async () => {
		const link = createTestLink({ text: "Sign Up Now", url: "/signup" });
		const html = await render(createZoneCallToAction({ link }));
		expect(html).toContain("Sign Up Now");
		expect(html).toContain('href="/signup"');
	});

	it("applies zone-cta__link class to the link wrapper", async () => {
		const html = await render(createZoneCallToAction());
		expect(html).toContain("zone-cta__link");
	});

	it("renders Button component with extended prop", async () => {
		const html = await render(createZoneCallToAction());
		// Button with extended creates a full-width button
		expect(html).toContain("button");
	});

	it("does not render Image when picture is not provided", async () => {
		const html = await render(createZoneCallToAction({ picture: undefined }));
		expect(html).not.toContain("zone-cta__media");
	});

	it("renders Image when picture is provided", async () => {
		const picture = createImageProps({
			src: "https://cdn.example.com/cta-image.jpg",
			alt: "CTA promotional image",
		});
		const html = await render(createZoneCallToAction({ picture }));
		expect(html).toContain("zone-cta__media");
		expect(html).toContain("https://cdn.example.com/cta-image.jpg");
	});

	it("applies zone-cta--with-media modifier when picture is present", async () => {
		const picture = createImageProps();
		const html = await render(createZoneCallToAction({ picture }));
		expect(html).toContain("zone-cta--with-media");
	});

	it("does not apply zone-cta--with-media modifier when picture is absent", async () => {
		const html = await render(createZoneCallToAction({ picture: undefined }));
		expect(html).not.toContain("zone-cta--with-media");
	});

	it("applies zone-cta__heading class to heading container", async () => {
		const html = await render(createZoneCallToAction());
		expect(html).toContain("zone-cta__heading");
	});

	it("escapes HTML in heading", async () => {
		const html = await render(
			createZoneCallToAction({ heading: "<script>alert('xss')</script>" }),
		);
		expect(html).toContain("&lt;script&gt;");
		expect(html).not.toContain("<script>alert");
	});

	it("handles external links correctly", async () => {
		const link = createTestLink({
			url: "https://external-site.com/signup",
			text: "Join External",
		});
		const html = await render(createZoneCallToAction({ link }));
		expect(html).toContain('href="https://external-site.com/signup"');
	});

	it("passes link target attribute", async () => {
		const link = createTestLink({ url: "/page" });
		const html = await render(createZoneCallToAction({ link }));
		expect(html).toContain('target="_blank"');
	});

	it("renders complete CTA with all elements", async () => {
		const picture = createImageProps({
			src: "/promo.jpg",
			alt: "Promo image",
		});
		const link = createTestLink({
			url: "/subscribe",
			text: "Subscribe Now",
		});
		const html = await render(
			createZoneCallToAction({
				heading: "Join Our Newsletter",
				subHeading: "Get updates directly to your inbox",
				link,
				picture,
			}),
		);

		expect(html).toContain("Join Our Newsletter");
		expect(html).toContain("Get updates directly to your inbox");
		expect(html).toContain("Subscribe Now");
		expect(html).toContain("/promo.jpg");
		expect(html).toContain('href="/subscribe"');
	});
});
