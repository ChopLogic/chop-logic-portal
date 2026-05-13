import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { beforeAll, describe, expect, it } from "vitest";
import type { CmsImage } from "../../../lib/content/models/image";
import CmsPicture from "../CmsPicture.astro";
import { CMS_PICTURE_SIZES } from "../cms-picture";

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
	}) {
		return container.renderToString(CmsPicture, { props });
	}

	it("renders a figure with responsive image attributes", async () => {
		const html = await render({ item: testCmsImage() });
		expect(html).toContain('<figure class="cms-picture"');
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
		expect(html).toContain('class="cms-picture zone-gallery-item-media"');
		expect(html).toContain(`sizes="${CMS_PICTURE_SIZES.galleryGrid}"`);
	});
});
