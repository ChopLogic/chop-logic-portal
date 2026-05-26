import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { beforeAll, describe, expect, it } from "vitest";
import type { CmsImage } from "../../../lib/content/models/image";
import Picture from "../Picture.astro";
import { CMS_PICTURE_SIZES } from "../Picture.helpers";

function testCmsImage(overrides: Partial<CmsImage> = {}): CmsImage {
	return {
		documentId: "doc-1",
		name: "photo.jpg",
		url: "https://cms.example.com/uploads/photo.jpg",
		width: 2000,
		height: 1333,
		alternativeText: "Alt text",
		formats: {
			large: {
				url: "https://cms.example.com/uploads/large.jpg",
				width: 1000,
				height: 667,
			},
		},
		...overrides,
	};
}

describe("CmsPicture.astro", () => {
	let container: Awaited<ReturnType<typeof AstroContainer.create>>;

	beforeAll(async () => {
		container = await AstroContainer.create();
	});

	async function render(props: {
		item: CmsImage;
		sizes?: string;
		class?: string;
		date?: Date;
	}) {
		return container.renderToString(Picture, { props });
	}

	it("renders a figure with responsive image attributes", async () => {
		const html = await render({ item: testCmsImage() });
		expect(html).toContain('<figure class="picture"');
		expect(html).toContain("<picture");
		expect(html).toContain('alt="Alt text"');
		expect(html).toContain('sizes="100vw"');
	});

	it("accepts custom sizes and class", async () => {
		const html = await render({
			item: testCmsImage(),
			sizes: CMS_PICTURE_SIZES.galleryGrid,
			class: "zone-gallery-item-media",
		});
		expect(html).toContain(`sizes="${CMS_PICTURE_SIZES.galleryGrid}"`);
	});

	it("renders caption and date when both are provided", async () => {
		const html = await render({
			item: testCmsImage({ caption: "Test caption" }),
			date: new Date("2026-03-04T12:00:00.000Z"),
		});
		expect(html).toContain("<figcaption");
		expect(html).toContain("Test caption");
		expect(html).toContain("Mar 4, 2026");
		expect(html).toContain("|");
	});

	it("renders caption without date when date is not provided", async () => {
		const html = await render({
			item: testCmsImage({ caption: "Test caption" }),
		});
		expect(html).toContain("<figcaption");
		expect(html).toContain("Test caption");
		expect(html).not.toContain("Mar");
	});
});
