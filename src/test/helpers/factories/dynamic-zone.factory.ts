import {
	type DynamicZoneCallToAction,
	DynamicZoneComponentType,
	type DynamicZoneContent,
	type DynamicZoneEmbeddedVideo,
	type DynamicZoneGallery,
	type DynamicZoneParagraph,
	type DynamicZonePicture,
	type DynamicZoneReferenceList,
} from "@models";
import type { GalleryItem, ImageProps } from "chop-logic-components";
import { createTestLink } from "./link.factory";
import { createRichTextContent } from "./rich-text.factory";

let zoneIdCounter = 0;

export function resetZoneIdCounter(): void {
	zoneIdCounter = 0;
}

export function createZoneParagraph(
	overrides: Partial<DynamicZoneParagraph> = {},
): DynamicZoneParagraph {
	return {
		type: DynamicZoneComponentType.Paragraph,
		id: overrides.id ?? `para-${++zoneIdCounter}`,
		heading: overrides.heading ?? "Paragraph Heading",
		content: overrides.content ?? createRichTextContent(),
		alignment: overrides.alignment ?? "left",
		...overrides,
	};
}

export function createImageProps(
	overrides: Partial<ImageProps> = {},
): ImageProps {
	return {
		src: overrides.src ?? "https://example.com/image.jpg",
		alt: overrides.alt ?? "Test image",
		...overrides,
	};
}

export function createZoneCallToAction(
	overrides: Partial<DynamicZoneCallToAction> = {},
): DynamicZoneCallToAction {
	return {
		type: DynamicZoneComponentType.CallToAction,
		id: overrides.id ?? `cta-${++zoneIdCounter}`,
		heading: overrides.heading ?? "Call to Action",
		link: overrides.link ?? createTestLink({ text: "Click here" }),
		...overrides,
	};
}

export function createGalleryItem(
	overrides: Partial<GalleryItem> = {},
): GalleryItem {
	return {
		src: overrides.src ?? `https://example.com/gallery-${++zoneIdCounter}.jpg`,
		alt: overrides.alt ?? `Gallery image ${zoneIdCounter}`,
		...overrides,
	};
}

export function createZoneGallery(
	overrides: Partial<DynamicZoneGallery> = {},
): DynamicZoneGallery {
	return {
		type: DynamicZoneComponentType.Gallery,
		id: overrides.id ?? `gallery-${++zoneIdCounter}`,
		heading: overrides.heading ?? "Gallery",
		layout: overrides.layout ?? "grid",
		items: overrides.items ?? [createGalleryItem(), createGalleryItem()],
		...overrides,
	};
}

export function createZoneEmbeddedVideo(
	overrides: Partial<DynamicZoneEmbeddedVideo> = {},
): DynamicZoneEmbeddedVideo {
	return {
		type: DynamicZoneComponentType.EmbeddedVideo,
		id: overrides.id ?? `video-${++zoneIdCounter}`,
		heading: overrides.heading ?? "Video",
		link:
			overrides.link ??
			createTestLink({
				url: "https://youtu.be/dQw4w9WgXcQ",
				text: "Watch video",
			}),
		embed: overrides.embed ?? {
			embedUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
			provider: "youtube",
		},
		...overrides,
	};
}

export function createZoneReferenceList(
	overrides: Partial<DynamicZoneReferenceList> = {},
): DynamicZoneReferenceList {
	return {
		type: DynamicZoneComponentType.ReferenceList,
		id: overrides.id ?? `refs-${++zoneIdCounter}`,
		heading: overrides.heading ?? "References",
		links: overrides.links ?? [
			createTestLink({ text: "Reference 1" }),
			createTestLink({ text: "Reference 2" }),
		],
		...overrides,
	};
}

export function createZonePicture(
	overrides: Partial<DynamicZonePicture> = {},
): DynamicZonePicture {
	return {
		type: DynamicZoneComponentType.Picture,
		id: overrides.id ?? `pic-${++zoneIdCounter}`,
		item: overrides.item ?? createImageProps(),
		publicationDate: overrides.publicationDate ?? new Date("2024-06-15"),
		...overrides,
	};
}

export function createDynamicZoneContent(
	components?: DynamicZoneContent,
): DynamicZoneContent {
	return components ?? [createZoneParagraph()];
}

export function createEmptyDynamicZoneContent(): DynamicZoneContent {
	return [];
}

export function createCompleteDynamicZoneContent(): DynamicZoneContent {
	return [
		createZoneParagraph(),
		createZoneCallToAction(),
		createZoneGallery(),
		createZoneEmbeddedVideo(),
		createZoneReferenceList(),
		createZonePicture(),
	];
}
