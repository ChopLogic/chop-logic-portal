import { DynamicZoneComponentType } from "@models";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
	mapDynamicZoneContent,
	mapEmbeddedVideo,
	mapGallery,
	mapPicture,
	mapReferenceList,
	mapZoneCallToAction,
	mapZoneParagraph,
} from "../dynamic-zone";
import {
	createCallToActionComponent,
	createDetectableCallToActionComponent,
	createDetectableEmbeddedVideoComponent,
	createDetectableGalleryComponent,
	createDetectableParagraphComponent,
	createDetectableReferenceListComponent,
	createEmbeddedVideoComponent,
	createGalleryComponent,
	createMockDynamicZoneContent,
	createParagraphComponent,
	createPictureComponent,
	createReferenceListComponent,
	createRestApiParagraphComponent,
} from "./fixtures";

// Mock dependencies
vi.mock("../checkers", () => ({
	isRecord: vi.fn(
		(v) => typeof v === "object" && v !== null && !Array.isArray(v),
	),
}));

vi.mock("../normalizers", () => ({
	normalizeRequiredString: vi.fn((v, d) => {
		if (typeof v === "string") return String(v).trim();
		if (!d) throw new Error(`Value ${JSON.stringify(v)} is not a string`);
		return d;
	}),
	normalizeOptionalString: vi.fn((v, d) => {
		if (!v || typeof v === "object") return d;
		return String(v).trim();
	}),
	normalizeRequiredDate: vi.fn((v) => {
		if (v instanceof Date) return v;
		const raw = typeof v === "string" ? v.trim() : String(v);
		const iso = raw.includes("T") ? raw : `${raw}T00:00:00.000Z`;
		return new Date(iso);
	}),
}));

const mockMapCmsImage = vi.fn();
const mockMapCMSImageToCLImage = vi.fn();

vi.mock("../image", () => ({
	mapCmsImage: (...args: unknown[]) => mockMapCmsImage(...args),
	mapCMSImageToCLImage: (...args: unknown[]) =>
		mockMapCMSImageToCLImage(...args),
}));

const mockMapLink = vi.fn();

vi.mock("../link", () => ({
	mapLink: (...args: unknown[]) => mockMapLink(...args),
}));

const mockMapRichTextBlock = vi.fn();

vi.mock("../rich-text-block", () => ({
	mapRichTextBlock: (...args: unknown[]) => mockMapRichTextBlock(...args),
}));

const mockResolveEmbedVideoSource = vi.fn();

vi.mock("../video", () => ({
	resolveEmbedVideoSource: (...args: unknown[]) =>
		mockResolveEmbedVideoSource(...args),
}));

const TEST_API_URL = "https://api.example.com";

describe("mapZoneParagraph", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockMapRichTextBlock.mockReturnValue([{ type: "paragraph", children: [] }]);
	});

	it("maps paragraph component with all fields", () => {
		const raw = createParagraphComponent();
		const result = mapZoneParagraph(raw);

		expect(result.type).toBe(DynamicZoneComponentType.Paragraph);
		expect(result.id).toBe("paragraph-123");
		expect(result.heading).toBe("Section Heading");
		expect(result.subHeading).toBe("A brief description of this section");
		expect(result.alignment).toBe("left");
	});

	it("maps paragraph with different alignments", () => {
		expect(
			mapZoneParagraph(createParagraphComponent({ alignment: "center" }))
				.alignment,
		).toBe("center");
		expect(
			mapZoneParagraph(createParagraphComponent({ alignment: "right" }))
				.alignment,
		).toBe("right");
	});

	it("defaults alignment to left for invalid values", () => {
		expect(
			mapZoneParagraph(createParagraphComponent({ alignment: "invalid" }))
				.alignment,
		).toBe("left");
		expect(
			mapZoneParagraph(createParagraphComponent({ alignment: null })).alignment,
		).toBe("left");
	});

	it("calls mapRichTextBlock with content", () => {
		const raw = createParagraphComponent();
		mapZoneParagraph(raw);

		expect(mockMapRichTextBlock).toHaveBeenCalledWith(raw.content);
	});

	it("throws error for non-record input", () => {
		expect(() => mapZoneParagraph("string")).toThrow("Expected a record");
		expect(() => mapZoneParagraph(null)).toThrow("Expected a record");
	});
});

describe("mapZoneCallToAction", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockMapLink.mockReturnValue({
			id: "link-123",
			url: "https://example.com",
			text: "Click me",
			target: "_blank",
			type: "external",
			referrerPolicy: "strict-origin-when-cross-origin",
		});
		mockMapCmsImage.mockReturnValue({
			documentId: "img-123",
			name: "cta.jpg",
			url: "/cta.jpg",
			width: 800,
			height: 600,
			formats: {},
		});
		mockMapCMSImageToCLImage.mockReturnValue({
			src: "/cta.jpg",
			alt: "CTA Image",
			loading: "lazy",
		});
	});

	it("maps call to action component with all fields", () => {
		const raw = createCallToActionComponent();
		const result = mapZoneCallToAction(raw, TEST_API_URL);

		expect(result.type).toBe(DynamicZoneComponentType.CallToAction);
		expect(result.id).toBe("cta-123");
		expect(result.heading).toBe("Ready to get started?");
		expect(result.subHeading).toBe("Join thousands of developers");
	});

	it("throws error when link is missing", () => {
		mockMapLink.mockReturnValue(null);
		const raw = createCallToActionComponent();

		expect(() => mapZoneCallToAction(raw, TEST_API_URL)).toThrow(
			"Call to action requires a valid link",
		);
	});

	it("calls mapCmsImage with picture and API URL", () => {
		const raw = createCallToActionComponent();
		mapZoneCallToAction(raw, TEST_API_URL);

		expect(mockMapCmsImage).toHaveBeenCalledWith(raw.picture, TEST_API_URL);
	});

	it("calls mapCMSImageToCLImage to convert image", () => {
		const raw = createCallToActionComponent();
		mapZoneCallToAction(raw, TEST_API_URL);

		expect(mockMapCMSImageToCLImage).toHaveBeenCalled();
	});
});

describe("mapEmbeddedVideo", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockMapLink.mockReturnValue({
			id: "video-link-123",
			url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
			text: "Video",
			target: "_blank",
			type: "external",
			referrerPolicy: "strict-origin-when-cross-origin",
		});
		mockResolveEmbedVideoSource.mockReturnValue({
			embedUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
			provider: "youtube",
		});
	});

	it("maps embedded video component with all fields", () => {
		const raw = createEmbeddedVideoComponent();
		const result = mapEmbeddedVideo(raw);

		expect(result.type).toBe(DynamicZoneComponentType.EmbeddedVideo);
		expect(result.id).toBe("video-123");
		expect(result.heading).toBe("Watch the Tutorial");
		expect(result.subHeading).toBe("Learn how to get started in 5 minutes");
		expect(result.aspectRatio).toBe("16/9");
	});

	it("throws error when link is missing", () => {
		mockMapLink.mockReturnValue(null);
		const raw = createEmbeddedVideoComponent();

		expect(() => mapEmbeddedVideo(raw)).toThrow(
			"Embedded video requires a valid link",
		);
	});

	it("calls resolveEmbedVideoSource with link URL", () => {
		const raw = createEmbeddedVideoComponent();
		mapEmbeddedVideo(raw);

		expect(mockResolveEmbedVideoSource).toHaveBeenCalledWith(
			"https://www.youtube.com/watch?v=dQw4w9WgXcQ",
		);
	});

	it("includes embed result in output", () => {
		const raw = createEmbeddedVideoComponent();
		const result = mapEmbeddedVideo(raw);

		expect(result.embed).toEqual({
			embedUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
			provider: "youtube",
		});
	});

	it("handles null embed result for unsupported video", () => {
		mockResolveEmbedVideoSource.mockReturnValue(null);
		const raw = createEmbeddedVideoComponent();
		const result = mapEmbeddedVideo(raw);

		expect(result.embed).toBeNull();
	});

	it("defaults aspectRatio to 16/9 when not provided", () => {
		const raw = createEmbeddedVideoComponent({ aspectRatio: null });
		const result = mapEmbeddedVideo(raw);

		expect(result.aspectRatio).toBe("16/9");
	});
});

describe("mapReferenceList", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockMapLink.mockImplementation((raw) => {
			if (!raw || typeof raw !== "object") return null;
			return {
				id: raw.id || "link-id",
				url: raw.url || "https://example.com",
				text: raw.text || "Link",
				target: "_blank",
				type: "external",
				referrerPolicy: "strict-origin-when-cross-origin",
			};
		});
	});

	it("maps reference list component with all fields", () => {
		const raw = createReferenceListComponent();
		const result = mapReferenceList(raw);

		expect(result.type).toBe(DynamicZoneComponentType.ReferenceList);
		expect(result.id).toBe("refs-123");
		expect(result.heading).toBe("References");
		expect(result.subHeading).toBe("Further reading");
		expect(result.links).toHaveLength(3);
	});

	it("filters out null links", () => {
		mockMapLink.mockImplementation((raw) => {
			if (raw?.id === "ref-2") return null;
			return {
				id: raw?.id || "link",
				url: "https://example.com",
				text: "Link",
			};
		});
		const raw = createReferenceListComponent();
		const result = mapReferenceList(raw);

		expect(result.links).toHaveLength(2);
	});

	it("returns empty links array for non-array links", () => {
		const raw = createReferenceListComponent();
		(raw as { links: unknown }).links = "not an array";
		const result = mapReferenceList(raw);

		expect(result.links).toEqual([]);
	});

	it("returns empty links array for null links", () => {
		const raw = createReferenceListComponent();
		(raw as { links: unknown }).links = null;
		const result = mapReferenceList(raw);

		expect(result.links).toEqual([]);
	});
});

describe("mapPicture", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockMapCmsImage.mockReturnValue({
			documentId: "pic-123",
			name: "picture.jpg",
			url: "/picture.jpg",
			width: 1200,
			height: 800,
			formats: {},
		});
		mockMapCMSImageToCLImage.mockReturnValue({
			src: "/picture.jpg",
			alt: "Picture",
			loading: "lazy",
		});
	});

	it("maps picture component with all fields", () => {
		const raw = createPictureComponent();
		const result = mapPicture(raw, TEST_API_URL);

		expect(result.type).toBe(DynamicZoneComponentType.Picture);
		expect(result.id).toBe("picture-123");
		expect(result.aspectRatio).toBe("4/3");
		expect(result.publicationDate).toBeInstanceOf(Date);
	});

	it("parses publication date correctly", () => {
		const raw = createPictureComponent({ publicationDate: "2024-06-15" });
		const result = mapPicture(raw, TEST_API_URL);

		expect(result.publicationDate.toISOString()).toBe(
			"2024-06-15T00:00:00.000Z",
		);
	});

	it("calls mapCmsImage with item and API URL", () => {
		const raw = createPictureComponent();
		mapPicture(raw, TEST_API_URL);

		expect(mockMapCmsImage).toHaveBeenCalledWith(raw.item, TEST_API_URL);
	});
});

describe("mapGallery", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockMapCmsImage.mockImplementation((raw) => {
			if (!raw) return null;
			return {
				documentId: raw.documentId || "gallery-item",
				name: raw.name || "image.jpg",
				url: "/gallery-image.jpg",
				width: 800,
				height: 600,
				formats: {},
			};
		});
		mockMapCMSImageToCLImage.mockReturnValue({
			src: "/gallery-image.jpg",
			alt: "Gallery image",
			loading: "lazy",
		});
	});

	it("maps gallery component with all fields", () => {
		const raw = createGalleryComponent();
		const result = mapGallery(raw, TEST_API_URL);

		expect(result.type).toBe(DynamicZoneComponentType.Gallery);
		expect(result.id).toBe("gallery-123");
		expect(result.heading).toBe("Photo Gallery");
		expect(result.subHeading).toBe("A collection of images");
		expect(result.layout).toBe("grid");
		expect(result.aspectRatio).toBe("1/1");
	});

	it("maps gallery items", () => {
		const raw = createGalleryComponent();
		const result = mapGallery(raw, TEST_API_URL);

		expect(result.items).toHaveLength(3);
		expect(mockMapCmsImage).toHaveBeenCalledTimes(3);
	});

	it("normalizes layout to grid for invalid values", () => {
		expect(
			mapGallery(createGalleryComponent({ layout: "invalid" }), TEST_API_URL)
				.layout,
		).toBe("grid");
		expect(
			mapGallery(createGalleryComponent({ layout: null }), TEST_API_URL).layout,
		).toBe("grid");
	});

	it("accepts masonry layout", () => {
		const result = mapGallery(
			createGalleryComponent({ layout: "masonry" }),
			TEST_API_URL,
		);
		expect(result.layout).toBe("masonry");
	});

	it("accepts carousel layout", () => {
		const result = mapGallery(
			createGalleryComponent({ layout: "carousel" }),
			TEST_API_URL,
		);
		expect(result.layout).toBe("carousel");
	});

	it("filters out null items from gallery", () => {
		mockMapCmsImage.mockImplementation((raw) => {
			if (raw?.documentId === "gallery-2") return null;
			return {
				documentId: raw?.documentId,
				url: "/image.jpg",
				width: 800,
				height: 600,
			};
		});
		const raw = createGalleryComponent();
		const result = mapGallery(raw, TEST_API_URL);

		expect(result.items).toHaveLength(2);
	});

	it("returns empty items array for non-array items", () => {
		const raw = createGalleryComponent();
		(raw as { items: unknown }).items = "not an array";
		const result = mapGallery(raw, TEST_API_URL);

		expect(result.items).toEqual([]);
	});
});

describe("mapDynamicZoneContent", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockMapRichTextBlock.mockReturnValue([]);
		mockMapLink.mockReturnValue({
			id: "link-123",
			url: "https://example.com",
			text: "Link",
			target: "_blank",
			type: "external",
			referrerPolicy: "strict-origin-when-cross-origin",
		});
		mockMapCmsImage.mockReturnValue({
			documentId: "img-123",
			url: "/image.jpg",
			width: 800,
			height: 600,
			formats: {},
		});
		mockMapCMSImageToCLImage.mockReturnValue({
			src: "/image.jpg",
			alt: "Image",
			loading: "lazy",
		});
		mockResolveEmbedVideoSource.mockReturnValue({
			embedUrl: "https://youtube-nocookie.com/embed/abc",
			provider: "youtube",
		});
	});

	it("returns empty array for non-array input", () => {
		expect(mapDynamicZoneContent(null, TEST_API_URL)).toEqual([]);
		expect(mapDynamicZoneContent(undefined, TEST_API_URL)).toEqual([]);
		expect(mapDynamicZoneContent("string", TEST_API_URL)).toEqual([]);
		expect(mapDynamicZoneContent({}, TEST_API_URL)).toEqual([]);
	});

	it("returns empty array for empty input", () => {
		expect(mapDynamicZoneContent([], TEST_API_URL)).toEqual([]);
	});

	describe("block type detection via __typename", () => {
		it("detects Paragraph via GraphQL __typename", () => {
			const raw = [createParagraphComponent()];
			const result = mapDynamicZoneContent(raw, TEST_API_URL);

			expect(result).toHaveLength(1);
			expect(result[0]?.type).toBe(DynamicZoneComponentType.Paragraph);
		});

		it("detects CallToAction via GraphQL __typename", () => {
			const raw = [createCallToActionComponent()];
			const result = mapDynamicZoneContent(raw, TEST_API_URL);

			expect(result).toHaveLength(1);
			expect(result[0]?.type).toBe(DynamicZoneComponentType.CallToAction);
		});

		it("detects EmbeddedVideo via GraphQL __typename", () => {
			const raw = [createEmbeddedVideoComponent()];
			const result = mapDynamicZoneContent(raw, TEST_API_URL);

			expect(result).toHaveLength(1);
			expect(result[0]?.type).toBe(DynamicZoneComponentType.EmbeddedVideo);
		});

		it("detects Gallery via GraphQL __typename", () => {
			const raw = [createGalleryComponent()];
			const result = mapDynamicZoneContent(raw, TEST_API_URL);

			expect(result).toHaveLength(1);
			expect(result[0]?.type).toBe(DynamicZoneComponentType.Gallery);
		});

		it("detects ReferenceList via GraphQL __typename", () => {
			const raw = [createReferenceListComponent()];
			const result = mapDynamicZoneContent(raw, TEST_API_URL);

			expect(result).toHaveLength(1);
			expect(result[0]?.type).toBe(DynamicZoneComponentType.ReferenceList);
		});

		it("detects Picture/Media via GraphQL __typename", () => {
			const raw = [createPictureComponent()];
			const result = mapDynamicZoneContent(raw, TEST_API_URL);

			expect(result).toHaveLength(1);
			expect(result[0]?.type).toBe(DynamicZoneComponentType.Picture);
		});
	});

	describe("block type detection via __component (REST API)", () => {
		it("detects Paragraph via REST __component", () => {
			const raw = [createRestApiParagraphComponent()];
			const result = mapDynamicZoneContent(raw, TEST_API_URL);

			expect(result).toHaveLength(1);
			expect(result[0]?.type).toBe(DynamicZoneComponentType.Paragraph);
		});
	});

	describe("fallback block type detection", () => {
		it("detects Paragraph by content and alignment fields", () => {
			const raw = [createDetectableParagraphComponent()];
			const result = mapDynamicZoneContent(raw, TEST_API_URL);

			expect(result).toHaveLength(1);
			expect(result[0]?.type).toBe(DynamicZoneComponentType.Paragraph);
		});

		it("detects CallToAction by link and picture fields", () => {
			const raw = [createDetectableCallToActionComponent()];
			const result = mapDynamicZoneContent(raw, TEST_API_URL);

			expect(result).toHaveLength(1);
			expect(result[0]?.type).toBe(DynamicZoneComponentType.CallToAction);
		});

		it("detects EmbeddedVideo by link without picture", () => {
			const raw = [createDetectableEmbeddedVideoComponent()];
			const result = mapDynamicZoneContent(raw, TEST_API_URL);

			expect(result).toHaveLength(1);
			expect(result[0]?.type).toBe(DynamicZoneComponentType.EmbeddedVideo);
		});

		it("detects ReferenceList by a links array", () => {
			const raw = [createDetectableReferenceListComponent()];
			const result = mapDynamicZoneContent(raw, TEST_API_URL);

			expect(result).toHaveLength(1);
			expect(result[0]?.type).toBe(DynamicZoneComponentType.ReferenceList);
		});

		it("detects Gallery by items array and heading", () => {
			const raw = [createDetectableGalleryComponent()];
			const result = mapDynamicZoneContent(raw, TEST_API_URL);

			expect(result).toHaveLength(1);
			expect(result[0]?.type).toBe(DynamicZoneComponentType.Gallery);
		});
	});

	it("maps complete dynamic zone content array", () => {
		const raw = createMockDynamicZoneContent();
		const result = mapDynamicZoneContent(raw, TEST_API_URL);

		expect(result).toHaveLength(5);
	});

	it("skips unrecognized block types", () => {
		const raw = [
			createParagraphComponent(),
			{ unknownField: "value" }, // Should be skipped
			createGalleryComponent(),
		];
		const result = mapDynamicZoneContent(raw, TEST_API_URL);

		expect(result).toHaveLength(2);
	});

	it("skips non-record items in array", () => {
		const raw = [
			createParagraphComponent(),
			"string",
			123,
			null,
			createGalleryComponent(),
		];
		const result = mapDynamicZoneContent(raw, TEST_API_URL);

		expect(result).toHaveLength(2);
	});
});
