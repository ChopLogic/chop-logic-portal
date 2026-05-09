import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { beforeAll, describe, expect, it } from "vitest";
import {
	DynamicZoneComponentType,
	type DynamicZoneEmbeddedVideo,
} from "../../../lib/content/models/dynamic-zone";
import {
	type Link,
	LinkTarget,
	LinkType,
	ReferrerPolicy,
} from "../../../lib/content/models/link";
import ZoneEmbeddedVideo from "../ZoneEmbeddedVideo.astro";

function testLink(overrides: Partial<Link> = {}): Link {
	return {
		id: "link-1",
		url: "https://youtu.be/ZXnEJJu3IHQ?si=g6sYcWxaMmmtS8Ss",
		text: "YouTube Video Title",
		target: LinkTarget.Blank,
		type: LinkType.External,
		referrerpolicy: ReferrerPolicy.StrictOriginWhenCrossOrigin,
		...overrides,
	};
}

function testEmbeddedVideo(
	overrides: Partial<DynamicZoneEmbeddedVideo> = {},
): DynamicZoneEmbeddedVideo {
	return {
		type: DynamicZoneComponentType.EmbeddedVideo,
		id: "video-1",
		heading: "Featured video",
		subHeading: "Watch below",
		link: testLink(),
		...overrides,
	};
}

describe("ZoneEmbeddedVideo.astro", () => {
	let container: Awaited<ReturnType<typeof AstroContainer.create>>;

	beforeAll(async () => {
		container = await AstroContainer.create();
	});

	async function render(embeddedVideo: DynamicZoneEmbeddedVideo) {
		return container.renderToString(ZoneEmbeddedVideo, {
			props: { embeddedVideo },
		});
	}

	it("renders heading, subheading, and a responsive iframe", async () => {
		const html = await render(testEmbeddedVideo());
		expect(html).toContain(
			'<section class="zone-embedded-video zone-embedded-video--youtube"',
		);
		expect(html).toContain("Featured video");
		expect(html).toContain("Watch below");
		expect(html).toContain('class="zone-embedded-video-player"');
		expect(html).toContain("<iframe");
		expect(html).toContain(
			'src="https://www.youtube-nocookie.com/embed/ZXnEJJu3IHQ?rel=0&amp;modestbranding=1"',
		);
		expect(html).toContain('title="YouTube Video Title"');
		expect(html).toContain('loading="lazy"');
		expect(html).toContain("allowfullscreen");
		expect(html).toContain(
			'allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"',
		);
	});

	it("omits h3 when subHeading is not set", async () => {
		const html = await render(testEmbeddedVideo({ subHeading: undefined }));
		expect(html).not.toContain("<h3");
	});

	it("falls back to a link when the URL cannot be embedded", async () => {
		const html = await render(
			testEmbeddedVideo({
				link: testLink({
					url: "https://www.youtube.com/",
					text: "YouTube channel",
				}),
			}),
		);
		expect(html).toContain("zone-embedded-video-fallback");
		expect(html).not.toContain("<iframe");
		expect(html).toContain('href="https://www.youtube.com/"');
		expect(html).toContain("Watch YouTube channel");
	});

	it("adds a Vimeo provider modifier for Vimeo URLs", async () => {
		const html = await render(
			testEmbeddedVideo({
				link: testLink({ url: "https://vimeo.com/123456789" }),
			}),
		);
		expect(html).toContain("zone-embedded-video--vimeo");
		expect(html).toContain('src="https://player.vimeo.com/video/123456789"');
	});

	it("escapes dangerous characters in headings", async () => {
		const html = await render(
			testEmbeddedVideo({
				heading: "<script>",
				subHeading: "<img onerror>",
			}),
		);
		expect(html).toContain("&lt;script&gt;");
		expect(html).toContain("&lt;img onerror&gt;");
		expect(html).not.toContain("<script>");
	});
});
