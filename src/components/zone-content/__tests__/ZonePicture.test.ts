import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { beforeAll, describe, expect, it } from "vitest";
import {
	DynamicZoneComponentType,
	type DynamicZonePicture,
} from "../../../lib/content/models/dynamic-zone";
import type { CmsImage } from "../../../lib/content/models/image";
import ZonePicture from "../ZonePicture.astro";

function testCmsImage(overrides: Partial<CmsImage> = {}): CmsImage {
	return {
		documentId: "doc-1",
		name: "forest.jpg",
		url: "https://cms.example.com/uploads/forest.jpg",
		width: 2000,
		height: 1333,
		alternativeText: "Forest view",
		caption: "Forest view caption",
		formats: {
			small: {
				url: "https://cms.example.com/uploads/small_forest.jpg",
				width: 500,
				height: 333,
				mime: "image/jpeg",
			},
			large: {
				url: "https://cms.example.com/uploads/large_forest.jpg",
				width: 1000,
				height: 667,
				mime: "image/jpeg",
			},
		},
		...overrides,
	};
}

function testPicture(
	overrides: Partial<DynamicZonePicture> = {},
): DynamicZonePicture {
	return {
		type: DynamicZoneComponentType.Picture,
		id: "pic-1",
		item: testCmsImage(),
		publicationDate: new Date("2026-03-04T12:00:00.000Z"),
		...overrides,
	};
}

describe("ZonePicture.astro", () => {
	let container: Awaited<ReturnType<typeof AstroContainer.create>>;

	beforeAll(async () => {
		container = await AstroContainer.create();
	});

	async function render(picture: DynamicZonePicture) {
		return container.renderToString(ZonePicture, {
			props: { picture },
		});
	}

	it("renders a responsive picture inside a figure", async () => {
		const html = await render(testPicture());
		expect(html).toContain('<article class="zone-picture"');
		expect(html).toContain("cms-picture");
		expect(html).toContain("zone-picture-media");
		expect(html).toContain("<picture");
		expect(html).toContain("</picture>");
		expect(html).toContain('alt="Forest view"');
		expect(html).toContain('loading="lazy"');
		expect(html).toContain('decoding="async"');
	});

	it("uses Strapi format variants in srcset", async () => {
		const html = await render(testPicture());
		expect(html).toContain("srcset=");
		expect(html).toContain(
			"https://cms.example.com/uploads/small_forest.jpg 500w",
		);
		expect(html).toContain(
			"https://cms.example.com/uploads/large_forest.jpg 1000w",
		);
		expect(html).toContain("https://cms.example.com/uploads/forest.jpg 2000w");
		expect(html).toContain('sizes="100vw"');
	});

	it("defaults src to the large format when present", async () => {
		const html = await render(testPicture());
		expect(html).toContain(
			'src="https://cms.example.com/uploads/large_forest.jpg"',
		);
	});

	it("renders caption and publication date", async () => {
		const html = await render(testPicture());
		expect(html).toContain("<figcaption");
		expect(html).toContain("Forest view caption");
		expect(html).toContain('datetime="2026-03-04T12:00:00.000Z"');
		expect(html).toContain("Mar 4, 2026");
	});

	it("omits figcaption when caption is not set", async () => {
		const html = await render(
			testPicture({
				item: testCmsImage({ caption: undefined }),
			}),
		);
		expect(html).not.toContain("<figcaption");
	});

	it("uses empty alt when alternativeText is missing", async () => {
		const html = await render(
			testPicture({
				item: testCmsImage({ alternativeText: undefined }),
			}),
		);
		expect(html).toMatch(/\salt(?:=""|(?=\s))/);
	});

	it("escapes dangerous characters in caption", async () => {
		const html = await render(
			testPicture({
				item: testCmsImage({
					alternativeText: "<script>",
					caption: "<img onerror>",
				}),
			}),
		);
		expect(html).toContain("&lt;img onerror&gt;");
		expect(html).not.toContain("<img onerror");
	});
});
