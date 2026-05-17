/** biome-ignore-all lint/complexity/useLiteralKeys: Access to unknown keys */
import {
	type DynamicZoneCallToAction,
	type DynamicZoneComponent,
	DynamicZoneComponentType,
	type DynamicZoneContent,
	type DynamicZoneEmbeddedVideo,
	type DynamicZoneParagraph,
	type DynamicZonePicture,
	type DynamicZoneReferenceList,
} from "../models/dynamic-zone";
import { isRecord } from "./checkers";
import { normalizeOptionalString, normalizeRequiredString } from "./helpers";
import { mapCmsImage } from "./image";
import { mapLink, mapLinks } from "./link";
import { mapRichTextBlock } from "./rich-text-block";

function getCmsBaseUrl(): string {
	const baseUrl = import.meta.env.STRAPI_URL?.replace(/\/$/, "");
	if (!baseUrl) {
		throw new Error(
			"STRAPI_URL is not set. Copy .env.example to .env and point it at your Strapi instance.",
		);
	}
	return baseUrl;
}

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

function parsePublicationDate(value: unknown): Date {
	if (value instanceof Date) {
		return value;
	}

	const raw = normalizeRequiredString(value);
	const iso = raw.includes("T") ? raw : `${raw}T00:00:00.000Z`;
	const date = new Date(iso);
	if (Number.isNaN(date.getTime())) {
		throw new Error(
			`Value ${JSON.stringify(value)} is not a valid publication date`,
		);
	}
	return date;
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

export function mapZoneCallToAction(value: unknown): DynamicZoneCallToAction {
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
		const picture = mapCmsImage(raw["picture"], getCmsBaseUrl());
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
	};
}

export function mapReferenceList(value: unknown): DynamicZoneReferenceList {
	const raw = requireRecord(value);
	const linksRaw = raw["links"];

	return {
		type: DynamicZoneComponentType.ReferenceList,
		id: normalizeRequiredString(raw["id"]),
		heading: normalizeRequiredString(raw["heading"]),
		subHeading: normalizeOptionalString(raw["subHeading"]),
		links: Array.isArray(linksRaw) ? mapLinks(linksRaw) : [],
	};
}

export function mapPicture(value: unknown): DynamicZonePicture {
	const raw = requireRecord(value);
	const item = mapCmsImage(raw["item"], getCmsBaseUrl());
	if (!item) {
		throw new Error("Picture requires a valid item image");
	}

	return {
		type: DynamicZoneComponentType.Picture,
		id: normalizeRequiredString(raw["id"]),
		item,
		publicationDate: parsePublicationDate(raw["publicationDate"]),
	};
}

const graphQlTypenameToComponentType: Record<string, DynamicZoneComponentType> =
	{
		ComponentSectionsParagraph: DynamicZoneComponentType.Paragraph,
		ComponentSectionsCallToAction: DynamicZoneComponentType.CallToAction,
		ComponentSectionsEmbeddedVideo: DynamicZoneComponentType.EmbeddedVideo,
		ComponentSectionsReferenceList: DynamicZoneComponentType.ReferenceList,
		ComponentSectionsPicture: DynamicZoneComponentType.Picture,
		ComponentSectionsGallery: DynamicZoneComponentType.Gallery,
	};

const restComponentToComponentType: Record<string, DynamicZoneComponentType> = {
	"sections.paragraph": DynamicZoneComponentType.Paragraph,
	"sections.call-to-action": DynamicZoneComponentType.CallToAction,
	"sections.embedded-video": DynamicZoneComponentType.EmbeddedVideo,
	"sections.reference-list": DynamicZoneComponentType.ReferenceList,
	"sections.picture": DynamicZoneComponentType.Picture,
	"sections.gallery": DynamicZoneComponentType.Gallery,
};

function detectZoneBlockType(
	block: Record<string, unknown>,
): DynamicZoneComponentType | null {
	const typename = block["__typename"];
	if (
		typeof typename === "string" &&
		graphQlTypenameToComponentType[typename]
	) {
		return graphQlTypenameToComponentType[typename];
	}

	const component = block["__component"];
	if (
		typeof component === "string" &&
		restComponentToComponentType[component]
	) {
		return restComponentToComponentType[component];
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

	return null;
}

function mapDynamicZoneBlock(block: unknown): DynamicZoneComponent | null {
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
			return mapZoneCallToAction(block);
		case DynamicZoneComponentType.EmbeddedVideo:
			return mapEmbeddedVideo(block);
		case DynamicZoneComponentType.ReferenceList:
			return mapReferenceList(block);
		case DynamicZoneComponentType.Picture:
			return mapPicture(block);
		default:
			return null;
	}
}

export function mapDynamicZoneContent(value: unknown): DynamicZoneContent {
	if (!Array.isArray(value)) {
		return [];
	}

	const components: DynamicZoneComponent[] = [];
	for (const block of value) {
		const mapped = mapDynamicZoneBlock(block);
		if (mapped) {
			components.push(mapped);
		}
	}
	return components;
}
