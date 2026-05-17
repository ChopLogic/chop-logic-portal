/** biome-ignore-all lint/complexity/useLiteralKeys: Access to unknown keys */
import {
	type DynamicZoneCallToAction,
	DynamicZoneComponentType,
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
