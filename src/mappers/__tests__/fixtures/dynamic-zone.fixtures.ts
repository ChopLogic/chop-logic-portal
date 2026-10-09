/**
 * Test fixtures for Strapi CMS dynamic zone component responses
 */

import {
	createMockCmsImageResponse,
	type MockCmsImageResponse,
} from "./image.fixtures";
import { createMockLinkResponse, type MockLinkResponse } from "./link.fixtures";
import {
	createMockRichTextContent,
	type MockRichTextBlock,
} from "./rich-text.fixtures";

export interface MockParagraphComponent {
	__typename?: string;
	__component?: string;
	id: string;
	heading: string;
	subHeading?: string | null;
	content: MockRichTextBlock[];
	alignment?: string | null;
}

export interface MockCallToActionComponent {
	__typename?: string;
	__component?: string;
	id: string;
	heading: string;
	subHeading?: string | null;
	picture: MockCmsImageResponse;
	link: MockLinkResponse;
}

export interface MockEmbeddedVideoComponent {
	__typename?: string;
	__component?: string;
	id: string;
	heading: string;
	subHeading?: string | null;
	aspectRatio?: string | null;
	link: MockLinkResponse;
}

export interface MockReferenceListComponent {
	__typename?: string;
	__component?: string;
	id: string;
	heading: string;
	subHeading?: string | null;
	links: MockLinkResponse[];
}

export interface MockPictureComponent {
	__typename?: string;
	__component?: string;
	id: string;
	publicationDate: string;
	aspectRatio?: string | null;
	item: MockCmsImageResponse;
}

export interface MockGalleryComponent {
	__typename?: string;
	__component?: string;
	id: string;
	heading: string;
	subHeading?: string | null;
	layout?: string | null;
	aspectRatio?: string | null;
	items: MockCmsImageResponse[];
}

export type MockDynamicZoneComponent =
	| MockParagraphComponent
	| MockCallToActionComponent
	| MockEmbeddedVideoComponent
	| MockReferenceListComponent
	| MockPictureComponent
	| MockGalleryComponent;

/**
 * Creates a paragraph component
 */
export function createParagraphComponent(
	overrides: Partial<MockParagraphComponent> = {},
): MockParagraphComponent {
	return {
		__typename: "ComponentSectionsParagraph",
		id: "paragraph-123",
		heading: "Section Heading",
		subHeading: "A brief description of this section",
		content: createMockRichTextContent(),
		alignment: "left",
		...overrides,
	};
}

/**
 * Creates a call to action component
 */
export function createCallToActionComponent(
	overrides: Partial<MockCallToActionComponent> = {},
): MockCallToActionComponent {
	return {
		__typename: "ComponentSectionsCallToAction",
		id: "cta-123",
		heading: "Ready to get started?",
		subHeading: "Join thousands of developers",
		picture: createMockCmsImageResponse({
			documentId: "cta-image-123",
			name: "cta-background.jpg",
		}),
		link: createMockLinkResponse({
			id: "cta-link-123",
			text: "Sign Up Now",
			url: "https://example.com/signup",
		}),
		...overrides,
	};
}

/**
 * Creates an embedded video component
 */
export function createEmbeddedVideoComponent(
	overrides: Partial<MockEmbeddedVideoComponent> = {},
): MockEmbeddedVideoComponent {
	return {
		__typename: "ComponentSectionsEmbeddedVideo",
		id: "video-123",
		heading: "Watch the Tutorial",
		subHeading: "Learn how to get started in 5 minutes",
		aspectRatio: "16/9",
		link: createMockLinkResponse({
			id: "video-link-123",
			text: "Tutorial Video",
			url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
		}),
		...overrides,
	};
}

/**
 * Creates a reference list component
 */
export function createReferenceListComponent(
	overrides: Partial<MockReferenceListComponent> = {},
): MockReferenceListComponent {
	return {
		__typename: "ComponentSectionsReferenceList",
		id: "refs-123",
		heading: "References",
		subHeading: "Further reading",
		links: [
			createMockLinkResponse({
				id: "ref-1",
				text: "Reference 1",
				url: "https://ref1.com",
			}),
			createMockLinkResponse({
				id: "ref-2",
				text: "Reference 2",
				url: "https://ref2.com",
			}),
			createMockLinkResponse({
				id: "ref-3",
				text: "Reference 3",
				url: "https://ref3.com",
			}),
		],
		...overrides,
	};
}

/**
 * Creates a picture/media component
 */
export function createPictureComponent(
	overrides: Partial<MockPictureComponent> = {},
): MockPictureComponent {
	return {
		__typename: "ComponentSectionsMedia",
		id: "picture-123",
		publicationDate: "2024-06-15",
		aspectRatio: "4/3",
		item: createMockCmsImageResponse({
			documentId: "media-image-123",
			name: "featured-image.jpg",
		}),
		...overrides,
	};
}

/**
 * Creates a gallery component
 */
export function createGalleryComponent(
	overrides: Partial<MockGalleryComponent> = {},
): MockGalleryComponent {
	return {
		__typename: "ComponentSectionsGallery",
		id: "gallery-123",
		heading: "Photo Gallery",
		subHeading: "A collection of images",
		layout: "grid",
		aspectRatio: "1/1",
		items: [
			createMockCmsImageResponse({
				documentId: "gallery-1",
				name: "image-1.jpg",
			}),
			createMockCmsImageResponse({
				documentId: "gallery-2",
				name: "image-2.jpg",
			}),
			createMockCmsImageResponse({
				documentId: "gallery-3",
				name: "image-3.jpg",
			}),
		],
		...overrides,
	};
}

/**
 * Creates a component with REST API structure (__component instead of __typename)
 */
export function createRestApiParagraphComponent(
	overrides: Partial<MockParagraphComponent> = {},
): MockParagraphComponent {
	return {
		__component: "sections.paragraph",
		id: "rest-paragraph-123",
		heading: "REST API Section",
		content: createMockRichTextContent(),
		alignment: "center",
		...overrides,
	};
}

/**
 * Creates a complete dynamic zone content array with various components
 */
export function createMockDynamicZoneContent(): MockDynamicZoneComponent[] {
	return [
		createParagraphComponent({ id: "intro-paragraph" }),
		createEmbeddedVideoComponent({ id: "tutorial-video" }),
		createGalleryComponent({ id: "photo-gallery" }),
		createCallToActionComponent({ id: "main-cta" }),
		createReferenceListComponent({ id: "references" }),
	];
}

/**
 * Creates a component without __typename or __component (fallback detection)
 */
export function createDetectableParagraphComponent(): Omit<
	MockParagraphComponent,
	"__typename" | "__component"
> {
	return {
		id: "detectable-paragraph",
		heading: "Detectable Section",
		content: createMockRichTextContent(),
		alignment: "right",
	};
}

/**
 * Creates a component that should be detected as CallToAction (has link and picture)
 */
export function createDetectableCallToActionComponent(): Omit<
	MockCallToActionComponent,
	"__typename" | "__component"
> {
	return {
		id: "detectable-cta",
		heading: "CTA Heading",
		picture: createMockCmsImageResponse(),
		link: createMockLinkResponse(),
	};
}

/**
 * Creates a component that should be detected as EmbeddedVideo (has link, no picture)
 */
export function createDetectableEmbeddedVideoComponent(): Omit<
	MockEmbeddedVideoComponent,
	"__typename" | "__component"
> {
	return {
		id: "detectable-video",
		heading: "Video Heading",
		link: createMockLinkResponse({
			url: "https://www.youtube.com/watch?v=test123",
		}),
	};
}
