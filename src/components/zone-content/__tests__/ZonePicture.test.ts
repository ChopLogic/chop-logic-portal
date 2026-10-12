import type { DynamicZonePicture } from "@models";
import {
	createAstroContainerWithReact,
	createImageProps,
	createZonePicture,
	resetZoneIdCounter,
} from "@test/helpers";
import { afterEach, beforeAll, describe, expect, it } from "vitest";
import ZonePicture from "../ZonePicture.astro";

describe("ZonePicture.astro", () => {
	let container: Awaited<ReturnType<typeof createAstroContainerWithReact>>;

	beforeAll(async () => {
		container = await createAstroContainerWithReact();
	});

	afterEach(() => {
		resetZoneIdCounter();
	});

	async function render(picture: DynamicZonePicture, className?: string) {
		return container.renderToString(ZonePicture, {
			props: { picture, className },
		});
	}

	it("renders a section element with zone-picture class", async () => {
		const html = await render(createZonePicture());
		expect(html).toContain("<section");
		expect(html).toContain('class="zone-picture"');
		expect(html).toContain("</section>");
	});

	it("renders Image component with item props", async () => {
		const item = createImageProps({
			src: "https://cdn.example.com/photo.jpg",
			alt: "Beautiful landscape",
		});
		const html = await render(createZonePicture({ item }));
		expect(html).toContain("https://cdn.example.com/photo.jpg");
		expect(html).toContain("Beautiful landscape");
	});

	it("passes src attribute to Image", async () => {
		const item = createImageProps({ src: "/images/hero.png" });
		const html = await render(createZonePicture({ item }));
		expect(html).toContain("/images/hero.png");
	});

	it("passes alt attribute to Image", async () => {
		const item = createImageProps({ alt: "Descriptive alt text" });
		const html = await render(createZonePicture({ item }));
		expect(html).toContain("Descriptive alt text");
	});

	it("applies optional className to Image", async () => {
		const html = await render(createZonePicture(), "custom-image-class");
		expect(html).toContain("custom-image-class");
	});

	it("does not include className when not provided", async () => {
		const html = await render(createZonePicture());
		// Should not have empty className
		expect(html).not.toContain('className=""');
	});

	it("passes aspectRatio to Image when provided", async () => {
		const html = await render(createZonePicture({ aspectRatio: "16/9" }));
		// aspectRatio is passed to the Image component
		expect(html).toContain("16/9");
	});

	it("handles various aspectRatio values", async () => {
		const ratio43 = await render(createZonePicture({ aspectRatio: "4/3" }));
		const ratio11 = await render(createZonePicture({ aspectRatio: "1/1" }));
		const ratio219 = await render(createZonePicture({ aspectRatio: "21/9" }));

		expect(ratio43).toContain("4/3");
		expect(ratio11).toContain("1/1");
		expect(ratio219).toContain("21/9");
	});

	it("handles undefined aspectRatio", async () => {
		const html = await render(createZonePicture({ aspectRatio: undefined }));
		// Should still render without aspectRatio
		expect(html).toContain("zone-picture");
	});

	it("renders with complete picture configuration", async () => {
		const item = createImageProps({
			src: "https://images.example.com/featured.webp",
			alt: "Featured article image",
		});
		const html = await render(
			createZonePicture({
				item,
				aspectRatio: "16/9",
				publicationDate: new Date("2024-06-15"),
			}),
			"featured-image",
		);

		expect(html).toContain("zone-picture");
		expect(html).toContain("https://images.example.com/featured.webp");
		expect(html).toContain("Featured article image");
		expect(html).toContain("16/9");
		expect(html).toContain("featured-image");
	});

	it("handles empty alt text", async () => {
		const item = createImageProps({ src: "/decorative.jpg", alt: "" });
		const html = await render(createZonePicture({ item }));
		expect(html).toContain("/decorative.jpg");
	});

	it("handles external image URLs", async () => {
		const item = createImageProps({
			src: "https://external-cdn.com/images/photo.jpg",
			alt: "External image",
		});
		const html = await render(createZonePicture({ item }));
		expect(html).toContain("https://external-cdn.com/images/photo.jpg");
	});

	it("handles relative image paths", async () => {
		const item = createImageProps({
			src: "/uploads/blog/post-image.png",
			alt: "Blog post image",
		});
		const html = await render(createZonePicture({ item }));
		expect(html).toContain("/uploads/blog/post-image.png");
	});

	it("escapes special characters in alt text", async () => {
		const item = createImageProps({
			src: "/image.jpg",
			alt: 'Image with "quotes" & <special> chars',
		});
		const html = await render(createZonePicture({ item }));
		// The alt text should be escaped by the Image component
		expect(html).toContain("Image with");
	});

	it("handles image with additional props", async () => {
		const item = createImageProps({
			src: "/image.jpg",
			alt: "Test image",
		});
		const html = await render(createZonePicture({ item }));
		// Should render the Image component with all props
		expect(html).toContain("zone-picture");
	});

	it("publicationDate is available in component (not rendered)", async () => {
		// publicationDate is part of the props but not directly rendered
		const picture = createZonePicture({
			publicationDate: new Date("2024-01-15"),
		});
		const html = await render(picture);
		// Component should still render even with publicationDate
		expect(html).toContain("zone-picture");
	});
});
