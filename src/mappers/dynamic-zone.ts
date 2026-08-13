/** biome-ignore-all lint/complexity/useLiteralKeys: Access to unknown keys */

import {
	GRAPHQL_TYPENAME_TO_COMPONENT_TYPE,
	REST_COMPONENT_TO_COMPONENT_TYPE,
} from "@constants";
import {
	type CmsImage,
	type DynamicZoneCallToAction,
	type DynamicZoneComponent,
	DynamicZoneComponentType,
	type DynamicZoneContent,
	type DynamicZoneEmbeddedVideo,
	type DynamicZoneGallery,
	type DynamicZoneParagraph,
	type DynamicZonePicture,
	type DynamicZoneReferenceList,
	type Link,
} from "@models";
import { isRecord } from "./checkers";
import { mapCmsImage } from "./image";
import { mapLink } from "./link";
import {
	normalizeOptionalString,
	normalizeRequiredDate,
	normalizeRequiredString,
} from "./normalizers";
import { mapRichTextBlock } from "./rich-text-block";

function requireRecord(value: unknown): Record<string, unknown> {
	if (!isRecord(value)) {
		throw new Error(`Expected a record, got ${JSON.stringify(value)}`);
	}
	return value;
}

function normalizeAlignment(value: unknown): "left" | "center" | "right" {
	if (value === "center" || value === "right") {
		return value;
	}
	return "left";
}

function normalizeGalleryLayout(
	value: unknown,
): "grid" | "masonry" | "carousel" {
	if (value === "masonry" || value === "carousel") {
		return value;
	}
	return "grid";
}

function normalizeGalleryItems(value: unknown, apiUrl: string): CmsImage[] {
	if (!Array.isArray(value)) {
		return [];
	}

	return value
		.map((item) => mapCmsImage(item, apiUrl))
		.filter((item): item is NonNullable<typeof item> => item != null);
}

function normalizeReferenceListLinks(value: unknown): Link[] {
	if (!Array.isArray(value)) {
		return [];
	}

	return value
		.map((item) => mapLink(item))
		.filter((item): item is NonNullable<typeof item> => item != null);
}

function mapRequiredLink(raw: unknown, label: string) {
	const link = mapLink(raw);
	if (!link) {
		throw new Error(`${label} requires a valid link`);
	}
	return link;
}

export function mapZoneParagraph(value: unknown): DynamicZoneParagraph {
	const raw = requireRecord(value);

	return {
		type: DynamicZoneComponentType.Paragraph,
		id: normalizeRequiredString(raw["id"]),
		heading: normalizeRequiredString(raw["heading"]),
		subHeading: normalizeOptionalString(raw["subHeading"]),
		content: mapRichTextBlock(raw["content"]),
		alignment: normalizeAlignment(raw["alignment"]),
	};
}

export function mapZoneCallToAction(
	value: unknown,
	apiUrl: string,
): DynamicZoneCallToAction {
	const raw = requireRecord(value);
	const link = mapRequiredLink(raw["link"], "Call to action");

	const result: DynamicZoneCallToAction = {
		type: DynamicZoneComponentType.CallToAction,
		id: normalizeRequiredString(raw["id"]),
		heading: normalizeRequiredString(raw["heading"]),
		subHeading: normalizeOptionalString(raw["subHeading"]),
		link,
	};

	if ("picture" in raw && raw["picture"] != null) {
		const picture = mapCmsImage(raw["picture"], apiUrl);
		if (!picture) {
			throw new Error("Call to action picture could not be mapped");
		}
		return { ...result, picture };
	}

	return result;
}

export function mapEmbeddedVideo(value: unknown): DynamicZoneEmbeddedVideo {
	const raw = requireRecord(value);

	return {
		type: DynamicZoneComponentType.EmbeddedVideo,
		id: normalizeRequiredString(raw["id"]),
		heading: normalizeRequiredString(raw["heading"]),
		subHeading: normalizeOptionalString(raw["subHeading"]),
		link: mapRequiredLink(raw["link"], "Embedded video"),
		aspectRatio: normalizeOptionalString(raw["aspectRatio"]),
	};
}

export function mapReferenceList(value: unknown): DynamicZoneReferenceList {
	const raw = requireRecord(value);

	return {
		type: DynamicZoneComponentType.ReferenceList,
		id: normalizeRequiredString(raw["id"]),
		heading: normalizeRequiredString(raw["heading"]),
		subHeading: normalizeOptionalString(raw["subHeading"]),
		links: normalizeReferenceListLinks(raw["links"]),
	};
}

export function mapPicture(value: unknown, apiUrl: string): DynamicZonePicture {
	const raw = requireRecord(value);
	const item = mapCmsImage(raw["item"], apiUrl);
	if (!item) {
		throw new Error("Picture requires a valid item image");
	}

	return {
		type: DynamicZoneComponentType.Picture,
		id: normalizeRequiredString(raw["id"]),
		publicationDate: normalizeRequiredDate(raw["publicationDate"]),
		item,
		aspectRatio: normalizeOptionalString(raw["aspectRatio"]),
	};
}

export function mapGallery(value: unknown, apiUrl: string): DynamicZoneGallery {
	const raw = requireRecord(value);

	return {
		type: DynamicZoneComponentType.Gallery,
		id: normalizeRequiredString(raw["id"]),
		heading: normalizeRequiredString(raw["heading"]),
		subHeading: normalizeOptionalString(raw["subHeading"]),
		layout: normalizeGalleryLayout(raw["layout"]),
		items: normalizeGalleryItems(raw["items"], apiUrl),
		aspectRatio: normalizeOptionalString(raw["aspectRatio"]),
	};
}

function detectZoneBlockType(
	block: Record<string, unknown>,
): DynamicZoneComponentType | null {
	const typename = block["__typename"];
	if (
		typeof typename === "string" &&
		GRAPHQL_TYPENAME_TO_COMPONENT_TYPE[typename]
	) {
		return GRAPHQL_TYPENAME_TO_COMPONENT_TYPE[typename];
	}

	const component = block["__component"];
	if (
		typeof component === "string" &&
		REST_COMPONENT_TO_COMPONENT_TYPE[component]
	) {
		return REST_COMPONENT_TO_COMPONENT_TYPE[component];
	}

	if (Array.isArray(block["links"])) {
		return DynamicZoneComponentType.ReferenceList;
	}

	if (block["item"] != null && block["publicationDate"] != null) {
		return DynamicZoneComponentType.Picture;
	}

	if (Array.isArray(block["content"]) && block["alignment"] != null) {
		return DynamicZoneComponentType.Paragraph;
	}

	if (block["link"] != null) {
		return "picture" in block
			? DynamicZoneComponentType.CallToAction
			: DynamicZoneComponentType.EmbeddedVideo;
	}

	if (Array.isArray(block["items"]) && block["heading"] != null) {
		return DynamicZoneComponentType.Gallery;
	}

	return null;
}

function mapDynamicZoneBlock(
	block: unknown,
	apiUrl: string,
): DynamicZoneComponent | null {
	if (!isRecord(block)) {
		return null;
	}

	const kind = detectZoneBlockType(block);
	if (!kind) {
		return null;
	}

	switch (kind) {
		case DynamicZoneComponentType.Paragraph:
			return mapZoneParagraph(block);
		case DynamicZoneComponentType.CallToAction:
			return mapZoneCallToAction(block, apiUrl);
		case DynamicZoneComponentType.EmbeddedVideo:
			return mapEmbeddedVideo(block);
		case DynamicZoneComponentType.ReferenceList:
			return mapReferenceList(block);
		case DynamicZoneComponentType.Picture:
			return mapPicture(block, apiUrl);
		case DynamicZoneComponentType.Gallery:
			return mapGallery(block, apiUrl);
		default:
			return null;
	}
}

export function mapDynamicZoneContent(
	value: unknown,
	apiUrl: string,
): DynamicZoneContent {
	if (!Array.isArray(value)) {
		return [];
	}

	const components: DynamicZoneComponent[] = [];
	for (const block of value) {
		const mapped = mapDynamicZoneBlock(block, apiUrl);
		if (mapped) {
			components.push(mapped);
		}
	}
	return components;
}
