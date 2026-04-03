/** biome-ignore-all lint/complexity/useLiteralKeys: dynamic Strapi media keys */
import { isRecord } from "../../checks";
import type {
	CmsImage,
	CmsImageFormatName,
	CmsImageFormatVariant,
} from "../models";

const FORMAT_NAMES: readonly CmsImageFormatName[] = [
	"thumbnail",
	"small",
	"medium",
	"large",
];

function isFormatName(k: string): k is CmsImageFormatName {
	return (FORMAT_NAMES as readonly string[]).includes(k);
}

function mapFormatVariant(raw: unknown): CmsImageFormatVariant | null {
	if (!isRecord(raw)) {
		return null;
	}
	const url = raw["url"];
	const width = raw["width"];
	const height = raw["height"];
	if (
		typeof url !== "string" ||
		typeof width !== "number" ||
		typeof height !== "number"
	) {
		return null;
	}
	const mime = raw["mime"];
	return {
		url,
		width,
		height,
		...(typeof mime === "string" ? { mime } : {}),
	};
}

export function mapCmsImage(raw: unknown): CmsImage | null {
	if (raw == null || !isRecord(raw)) {
		return null;
	}
	const documentId = raw["documentId"];
	const name = raw["name"];
	const url = raw["url"];
	const width = raw["width"];
	const height = raw["height"];
	if (
		typeof documentId !== "string" ||
		typeof name !== "string" ||
		typeof url !== "string" ||
		typeof width !== "number" ||
		typeof height !== "number"
	) {
		return null;
	}
	const formatsRaw = raw["formats"];
	const formats: Partial<Record<CmsImageFormatName, CmsImageFormatVariant>> =
		{};
	if (isRecord(formatsRaw)) {
		for (const [key, value] of Object.entries(formatsRaw)) {
			if (!isFormatName(key)) {
				continue;
			}
			const v = mapFormatVariant(value);
			if (v) {
				formats[key] = v;
			}
		}
	}
	const alt = raw["alternativeText"];
	const cap = raw["caption"];
	return {
		documentId,
		name,
		url,
		width,
		height,
		alternativeText: typeof alt === "string" ? alt : null,
		caption: typeof cap === "string" ? cap : null,
		formats,
	};
}

export function resolveMediaAbsoluteUrl(
	baseUrl: string,
	pathOrUrl: string,
): string {
	if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) {
		return pathOrUrl;
	}
	return new URL(pathOrUrl, `${baseUrl.replace(/\/$/, "")}/`).toString();
}

/** Absolute URL for the default (original) asset. */
export function cmsImageDefaultSrc(image: CmsImage, baseUrl: string): string {
	return resolveMediaAbsoluteUrl(baseUrl, image.url);
}

/** Distinct widths from the original + format variants (sorted ascending). */
export function cmsImageWidthsForResponsive(image: CmsImage): number[] {
	const widths = new Set<number>([image.width]);
	for (const v of Object.values(image.formats)) {
		if (v) {
			widths.add(v.width);
		}
	}
	return [...widths].sort((a, b) => a - b);
}
