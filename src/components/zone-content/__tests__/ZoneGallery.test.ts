import type { DynamicZoneGallery } from "@models";
import {
	createAstroContainerWithReact,
	createGalleryItem,
	createZoneGallery,
	resetZoneIdCounter,
} from "@test/helpers";
import { afterEach, beforeAll, describe, expect, it } from "vitest";
import ZoneGallery from "../ZoneGallery.astro";

describe("ZoneGallery.astro", () => {
	let container: Awaited<ReturnType<typeof createAstroContainerWithReact>>;

	beforeAll(async () => {
		container = await createAstroContainerWithReact();
	});

	afterEach(() => {
		resetZoneIdCounter();
	});

	async function render(gallery: DynamicZoneGallery) {
		return container.renderToString(ZoneGallery, {
			props: { gallery },
		});
	}

	it("renders a section element with zone-gallery class", async () => {
		const html = await render(createZoneGallery());
		expect(html).toContain("<section");
		expect(html).toContain("zone-gallery");
		expect(html).toContain("</section>");
	});

	it("renders heading through ZoneHeadingBlock", async () => {
		const html = await render(createZoneGallery({ heading: "Photo Gallery" }));
		expect(html).toContain("<h2");
		expect(html).toContain("Photo Gallery");
	});

	it("renders subHeading when provided", async () => {
		const html = await render(
			createZoneGallery({
				heading: "Gallery",
				subHeading: "Our latest photos",
			}),
		);
		expect(html).toContain("Our latest photos");
	});

	it("applies grid layout class modifier", async () => {
		const html = await render(createZoneGallery({ layout: "grid" }));
		expect(html).toContain("zone-gallery--grid");
	});

	it("applies masonry layout class modifier", async () => {
		const html = await render(createZoneGallery({ layout: "masonry" }));
		expect(html).toContain("zone-gallery--masonry");
	});

	it("applies carousel layout class modifier", async () => {
		const html = await render(createZoneGallery({ layout: "carousel" }));
		expect(html).toContain("zone-gallery--carousel");
	});

	it("renders Gallery component", async () => {
		const html = await render(createZoneGallery());
		// Gallery component from chop-logic-components is rendered
		// It creates a container for gallery items
		expect(html).toContain("zone-gallery");
	});

	it("passes gallery items to Gallery component", async () => {
		const items = [
			createGalleryItem({
				src: "https://cdn.example.com/photo1.jpg",
				alt: "First photo",
			}),
			createGalleryItem({
				src: "https://cdn.example.com/photo2.jpg",
				alt: "Second photo",
			}),
		];
		const html = await render(createZoneGallery({ items }));
		expect(html).toContain("https://cdn.example.com/photo1.jpg");
		expect(html).toContain("https://cdn.example.com/photo2.jpg");
	});

	it("handles empty items array", async () => {
		const html = await render(createZoneGallery({ items: [] }));
		expect(html).toContain("zone-gallery");
		// Should still render the section and heading
		expect(html).toContain("<section");
	});

	it("handles single gallery item", async () => {
		const items = [
			createGalleryItem({
				src: "/single-image.jpg",
				alt: "Single image",
			}),
		];
		const html = await render(createZoneGallery({ items }));
		expect(html).toContain("/single-image.jpg");
	});

	it("handles multiple gallery items", async () => {
		const items = [
			createGalleryItem({ alt: "Image 1" }),
			createGalleryItem({ alt: "Image 2" }),
			createGalleryItem({ alt: "Image 3" }),
			createGalleryItem({ alt: "Image 4" }),
		];
		const html = await render(createZoneGallery({ items }));
		expect(html).toContain("Image 1");
		expect(html).toContain("Image 2");
		expect(html).toContain("Image 3");
		expect(html).toContain("Image 4");
	});

	it("escapes HTML in heading", async () => {
		const html = await render(
			createZoneGallery({ heading: "<script>alert('xss')</script>" }),
		);
		expect(html).toContain("&lt;script&gt;");
		expect(html).not.toContain("<script>alert");
	});

	it("escapes HTML in subHeading", async () => {
		const html = await render(
			createZoneGallery({
				heading: "Safe",
				subHeading: "<img onerror='alert(1)'>",
			}),
		);
		expect(html).toContain("&lt;img onerror");
	});

	it("handles complete gallery configuration", async () => {
		const items = [
			createGalleryItem({ src: "/photo1.jpg", alt: "Beach sunset" }),
			createGalleryItem({ src: "/photo2.jpg", alt: "Mountain view" }),
		];
		const html = await render(
			createZoneGallery({
				heading: "Travel Photos",
				subHeading: "Memories from our adventures",
				layout: "masonry",
				items,
			}),
		);

		expect(html).toContain("Travel Photos");
		expect(html).toContain("Memories from our adventures");
		expect(html).toContain("zone-gallery--masonry");
		expect(html).toContain("/photo1.jpg");
		expect(html).toContain("/photo2.jpg");
	});

	it("handles gallery items with unique sources", async () => {
		const items = [
			createGalleryItem({ src: "/unique-photo-1.jpg" }),
			createGalleryItem({ src: "/unique-photo-2.jpg" }),
		];
		const html = await render(createZoneGallery({ items }));
		expect(html).toContain("unique-photo-1");
		expect(html).toContain("unique-photo-2");
	});
});
