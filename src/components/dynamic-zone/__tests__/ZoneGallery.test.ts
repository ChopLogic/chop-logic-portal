import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { beforeAll, describe, expect, it } from "vitest";
import {
	DynamicZoneComponentType,
	type DynamicZoneGallery,
} from "../../../lib/content/models/dynamic-zone";
import type { CmsImage } from "../../../lib/content/models/image";
import { CMS_PICTURE_SIZES } from "../cms-picture";
import ZoneGallery from "../ZoneGallery.astro";

function testCmsImage(id: string, overrides: Partial<CmsImage> = {}): CmsImage {
	return {
		documentId: id,
		name: `${id}.jpg`,
		url: `https://cms.example.com/uploads/${id}.jpg`,
		width: 1200,
		height: 800,
		alternativeText: `Alt ${id}`,
		formats: {
			small: {
				url: `https://cms.example.com/uploads/small_${id}.jpg`,
				width: 500,
				height: 333,
			},
		},
		...overrides,
	};
}

function testGallery(
	overrides: Partial<DynamicZoneGallery> = {},
): DynamicZoneGallery {
	return {
		type: DynamicZoneComponentType.Gallery,
		id: "gallery-1",
		heading: "Gallery heading",
		subHeading: "Gallery subheading",
		layout: "grid",
		items: [testCmsImage("a"), testCmsImage("b")],
		...overrides,
	};
}

describe("ZoneGallery.astro", () => {
	let container: Awaited<ReturnType<typeof AstroContainer.create>>;

	beforeAll(async () => {
		container = await AstroContainer.create();
	});

	async function render(gallery: DynamicZoneGallery) {
		return container.renderToString(ZoneGallery, {
			props: { gallery },
		});
	}

	it("renders heading, subheading, and gallery items", async () => {
		const html = await render(testGallery());
		expect(html).toContain('<section class="zone-gallery zone-gallery--grid"');
		expect(html).toContain("<h2");
		expect(html).toContain("Gallery heading");
		expect(html).toContain("<h3");
		expect(html).toContain("Gallery subheading");
		expect(html).toContain('alt="Alt a"');
		expect(html).toContain('alt="Alt b"');
		expect(html).toContain('role="list"');
	});

	it("omits h3 when subHeading is not set", async () => {
		const html = await render(testGallery({ subHeading: undefined }));
		expect(html).not.toContain("<h3");
	});

	it.each([
		["grid", "zone-gallery--grid"],
		["masonry", "zone-gallery--masonry"],
		["carousel", "zone-gallery--carousel"],
	] as const)("applies layout modifier for %s", async (layout, className) => {
		const html = await render(testGallery({ layout }));
		expect(html).toContain(className);
	});

	it("uses gallery-specific sizes for grid layout", async () => {
		const html = await render(testGallery({ layout: "grid" }));
		expect(html).toContain(`sizes="${CMS_PICTURE_SIZES.galleryGrid}"`);
	});

	it("uses carousel sizes for carousel layout", async () => {
		const html = await render(testGallery({ layout: "carousel" }));
		expect(html).toContain(`sizes="${CMS_PICTURE_SIZES.galleryCarousel}"`);
	});

	it("includes responsive srcset for each item", async () => {
		const html = await render(testGallery());
		expect(html).toContain("srcset=");
		expect(html).toContain("small_a.jpg 500w");
		expect(html).toContain("small_b.jpg 500w");
	});

	it("renders captions when present", async () => {
		const html = await render(
			testGallery({
				items: [testCmsImage("a", { caption: "Caption A" }), testCmsImage("b")],
			}),
		);
		expect(html).toContain("Caption A");
		expect(html).not.toContain("Caption B");
	});

	it("escapes dangerous characters in headings and captions", async () => {
		const html = await render(
			testGallery({
				heading: "<script>",
				subHeading: "<img onerror>",
				items: [testCmsImage("a", { caption: "<evil>" })],
			}),
		);
		expect(html).toContain("&lt;script&gt;");
		expect(html).toContain("&lt;img onerror&gt;");
		expect(html).toContain("&lt;evil&gt;");
		expect(html).not.toContain("<script>");
	});
});
