import type { DynamicZoneEmbeddedVideo } from "@models";
import {
	createAstroContainer,
	createTestLink,
	createZoneEmbeddedVideo,
	resetLinkIdCounter,
	resetZoneIdCounter,
} from "@test/helpers";
import { afterEach, beforeAll, describe, expect, it } from "vitest";
import ZoneEmbeddedVideo from "../ZoneEmbeddedVideo.astro";

describe("ZoneEmbeddedVideo.astro", () => {
	let container: Awaited<ReturnType<typeof createAstroContainer>>;

	beforeAll(async () => {
		container = await createAstroContainer();
	});

	afterEach(() => {
		resetZoneIdCounter();
		resetLinkIdCounter();
	});

	async function render(embeddedVideo: DynamicZoneEmbeddedVideo) {
		return container.renderToString(ZoneEmbeddedVideo, {
			props: { embeddedVideo },
		});
	}

	it("renders a section element with zone-embedded-video class", async () => {
		const html = await render(createZoneEmbeddedVideo());
		expect(html).toContain("<section");
		expect(html).toContain("zone-embedded-video");
		expect(html).toContain("</section>");
	});

	it("renders heading through ZoneHeadingBlock", async () => {
		const html = await render(
			createZoneEmbeddedVideo({ heading: "Watch This Video" }),
		);
		expect(html).toContain("<h2");
		expect(html).toContain("Watch This Video");
	});

	it("renders subHeading when provided", async () => {
		const html = await render(
			createZoneEmbeddedVideo({
				heading: "Video Title",
				subHeading: "Learn more about our product",
			}),
		);
		expect(html).toContain("Learn more about our product");
	});

	it("renders iframe when embed is provided", async () => {
		const html = await render(
			createZoneEmbeddedVideo({
				embed: {
					embedUrl: "https://www.youtube-nocookie.com/embed/abc123",
					provider: "youtube",
				},
			}),
		);
		expect(html).toContain("<iframe");
		expect(html).toContain(
			'src="https://www.youtube-nocookie.com/embed/abc123"',
		);
	});

	it("applies player container class when embed exists", async () => {
		const html = await render(createZoneEmbeddedVideo());
		expect(html).toContain('class="zone-embedded-video__player"');
	});

	it("sets iframe title from link text", async () => {
		const link = createTestLink({ text: "Introduction Video" });
		const html = await render(createZoneEmbeddedVideo({ link }));
		expect(html).toContain('title="Introduction Video"');
	});

	it("falls back to heading for iframe title when link text is empty", async () => {
		const link = createTestLink({ text: "" });
		const html = await render(
			createZoneEmbeddedVideo({
				heading: "Fallback Title",
				link,
			}),
		);
		expect(html).toContain('title="Fallback Title"');
	});

	it("adds loading lazy attribute to iframe", async () => {
		const html = await render(createZoneEmbeddedVideo());
		expect(html).toContain('loading="lazy"');
	});

	it("adds allowfullscreen attribute to iframe", async () => {
		const html = await render(createZoneEmbeddedVideo());
		expect(html).toContain("allowfullscreen");
	});

	it("adds referrerpolicy from link props", async () => {
		const html = await render(createZoneEmbeddedVideo());
		expect(html).toContain("referrerpolicy=");
	});

	it("adds allow attribute for media permissions", async () => {
		const html = await render(createZoneEmbeddedVideo());
		expect(html).toContain(
			'allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"',
		);
	});

	it("applies provider class modifier when embed has provider", async () => {
		const html = await render(
			createZoneEmbeddedVideo({
				embed: {
					embedUrl: "https://example.com/embed",
					provider: "youtube",
				},
			}),
		);
		expect(html).toContain("zone-embedded-video--youtube");
	});

	it("applies vimeo provider class for vimeo videos", async () => {
		const html = await render(
			createZoneEmbeddedVideo({
				embed: {
					embedUrl: "https://player.vimeo.com/video/123",
					provider: "vimeo",
				},
			}),
		);
		expect(html).toContain("zone-embedded-video--vimeo");
	});

	it("applies aspectRatio style when provided", async () => {
		const html = await render(
			createZoneEmbeddedVideo({
				aspectRatio: "16/9",
			}),
		);
		// The aspectRatio is passed as inline style
		expect(html).toContain("16/9");
	});

	it("renders fallback message when embed is null", async () => {
		const html = await render(createZoneEmbeddedVideo({ embed: null }));
		expect(html).toContain("zone-embedded-video__fallback");
		expect(html).toContain("This video cannot be embedded");
	});

	it("renders link in fallback with link text", async () => {
		const link = createTestLink({ text: "Original Video" });
		const html = await render(createZoneEmbeddedVideo({ embed: null, link }));
		expect(html).toContain("Watch Original Video");
	});

	it("does not render iframe when embed is null", async () => {
		const html = await render(createZoneEmbeddedVideo({ embed: null }));
		expect(html).not.toContain("<iframe");
		expect(html).not.toContain("zone-embedded-video__player");
	});

	it("does not render fallback when embed exists", async () => {
		const html = await render(createZoneEmbeddedVideo());
		expect(html).not.toContain("zone-embedded-video__fallback");
		expect(html).not.toContain("This video cannot be embedded");
	});

	it("does not apply provider modifier when embed is null", async () => {
		const html = await render(createZoneEmbeddedVideo({ embed: null }));
		expect(html).not.toContain("zone-embedded-video--youtube");
		expect(html).not.toContain("zone-embedded-video--vimeo");
	});

	it("escapes HTML in heading", async () => {
		const html = await render(
			createZoneEmbeddedVideo({ heading: "<script>xss</script>" }),
		);
		expect(html).toContain("&lt;script&gt;");
		expect(html).not.toContain("<script>xss");
	});

	it("handles complete video configuration", async () => {
		const link = createTestLink({
			url: "https://youtu.be/abc123",
			text: "Watch Full Tutorial",
		});
		const html = await render(
			createZoneEmbeddedVideo({
				heading: "Getting Started Tutorial",
				subHeading: "A comprehensive guide for beginners",
				link,
				aspectRatio: "16/9",
				embed: {
					embedUrl: "https://www.youtube-nocookie.com/embed/abc123?rel=0",
					provider: "youtube",
				},
			}),
		);

		expect(html).toContain("Getting Started Tutorial");
		expect(html).toContain("A comprehensive guide for beginners");
		expect(html).toContain("youtube-nocookie.com/embed/abc123");
		expect(html).toContain("zone-embedded-video--youtube");
		expect(html).toContain('title="Watch Full Tutorial"');
	});
});
