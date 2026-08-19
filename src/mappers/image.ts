/** biome-ignore-all lint/complexity/useLiteralKeys: dynamic Strapi media keys */

import {
	DEFAULT_ALT_TEXT,
	DEFAULT_IMAGE,
	IMAGE_FORMAT_NAMES,
	OG_IMAGE_IDEAL_WIDTH,
	OG_IMAGE_MIN_HEIGHT,
	OG_IMAGE_MIN_WIDTH,
	OG_IMAGE_SOFT_MAX_WIDTH,
	SOURCE_DESCRIPTOR_BY_FORMAT_NAME,
} from "@constants";
import type {
	CmsImage,
	CmsImageFormatName,
	CmsImageFormats,
	CmsImageFormatVariant,
	OpenGraphCmsImagePick,
} from "@models";
import type { ImageProps, ImageSource } from "chop-logic-components";
import { isImageFormatName, isRecord } from "./checkers";
import {
	normalizeOptionalString,
	normalizeRequiredNumber,
	normalizeRequiredString,
} from "./normalizers";

function mapFormatVariant(
	raw: unknown,
	baseUrl: string,
): CmsImageFormatVariant | null {
	if (!isRecord(raw)) {
		return null;
	}

	return {
		url: resolveMediaAbsoluteUrl(normalizeRequiredString(raw["url"]), baseUrl),
		width: normalizeRequiredNumber(raw["width"], 0),
		height: normalizeRequiredNumber(raw["height"], 0),
		mime: normalizeOptionalString(raw["mime"]),
	};
}

function normalizeImageFormats(
	formatsRaw: unknown,
	baseUrl: string,
): CmsImageFormats {
	if (!isRecord(formatsRaw)) {
		return {};
	}
	const formats: CmsImageFormats = {};
	for (const [key, value] of Object.entries(formatsRaw)) {
		if (!isImageFormatName(key)) {
			continue;
		}
		const v = mapFormatVariant(value, baseUrl);
		if (v) {
			formats[key] = v;
		}
	}
	return formats;
}

export function mapCmsImage(raw: unknown, baseUrl: string): CmsImage | null {
	if (!isRecord(raw) || !raw["url"] || !raw["documentId"] || !raw["name"]) {
		return null;
	}

	return {
		documentId: normalizeRequiredString(raw["documentId"]),
		name: normalizeRequiredString(raw["name"]),
		url: resolveMediaAbsoluteUrl(normalizeRequiredString(raw["url"]), baseUrl),
		width: normalizeRequiredNumber(raw["width"]),
		height: normalizeRequiredNumber(raw["height"]),
		alternativeText: normalizeOptionalString(raw["alternativeText"]),
		caption: normalizeOptionalString(raw["caption"]),
		formats: normalizeImageFormats(raw["formats"], baseUrl),
	};
}

export function resolveMediaAbsoluteUrl(
	pathOrUrl: string,
	baseUrl: string,
): string {
	if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) {
		return pathOrUrl;
	}
	return new URL(pathOrUrl, `${baseUrl.replace(/\/$/, "")}/`).toString();
}

/**
 * Picks a Strapi `formats` variant (large → … → original) closest to recommended OG size,
 * instead of always using the full upload (smaller files, faster crawler fetches).
 */
export function pickOpenGraphCmsImage(
	image: CmsImage,
	baseUrl: string,
): OpenGraphCmsImagePick {
	const candidates: OpenGraphCmsImagePick[] = [];
	const push = (url: string, width: number, height: number) => {
		if (width > 0 && height > 0) {
			candidates.push({
				src: resolveMediaAbsoluteUrl(url, baseUrl),
				width,
				height,
			});
		}
	};

	for (const name of [...IMAGE_FORMAT_NAMES].reverse()) {
		const v = image.formats[name];
		if (v) {
			push(v.url, v.width, v.height);
		}
	}
	push(image.url, image.width, image.height);

	const meetsMinimum = (c: OpenGraphCmsImagePick) =>
		c.width >= OG_IMAGE_MIN_WIDTH && c.height >= OG_IMAGE_MIN_HEIGHT;
	let pool = candidates.filter(meetsMinimum);
	if (pool.length === 0) {
		pool = candidates;
	}

	const scoreWidth = (c: OpenGraphCmsImagePick): number => {
		if (c.width > OG_IMAGE_SOFT_MAX_WIDTH) {
			return c.width;
		}
		return Math.abs(c.width - OG_IMAGE_IDEAL_WIDTH);
	};

	pool.sort((a, b) => {
		const d = scoreWidth(a) - scoreWidth(b);
		if (d !== 0) {
			return d;
		}
		return b.width * b.height - a.width * a.height;
	});

	const best = pool[0];
	if (best) {
		return best;
	}

	return {
		src: resolveMediaAbsoluteUrl(image.url, baseUrl),
		width: image.width,
		height: image.height,
	};
}

export function mapCMSImageFormatsToSources(
	formats: CmsImageFormats,
): ImageSource[] {
	const sources: ImageSource[] = [];

	// Sort formats by width (smallest first)
	const formatOrder: CmsImageFormatName[] = ["small", "medium", "large"];

	for (const formatName of formatOrder) {
		const variant = formats[formatName];
		if (!variant) continue;

		sources.push({
			src: variant.url,
			type: variant.mime ?? "image/jpeg",
			descriptor: SOURCE_DESCRIPTOR_BY_FORMAT_NAME[formatName],
		});
	}

	return sources;
}

export function mapCMSImageToCLImage(
	image: CmsImage | null,
	aspectRatio?: string,
): ImageProps {
	if (!image) return DEFAULT_IMAGE;

	const fallbackImage =
		image.formats.small ?? image.formats.medium ?? image.formats.large ?? image;

	const sources = mapCMSImageFormatsToSources(image.formats);
	const alt = image?.alternativeText ?? DEFAULT_ALT_TEXT;
	const sizes = `(max-width: 500px) 500px, (max-width: 750px) 750px, 1000px`;

	return {
		src: fallbackImage.url,
		alt,
		sources,
		sizes,
		aspectRatio,
		loading: "lazy",
		caption: image.caption,
	};
}
