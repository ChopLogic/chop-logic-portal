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

/** Facebook / LinkedIn style cards: aim ~1200×630; Strapi cannot crop here — we pick the best preset. */
const OG_IDEAL_WIDTH = 1200;
const OG_MIN_WIDTH = 600;
const OG_MIN_HEIGHT = 315;
/** Above this width, treat as “original scale” and deprioritise vs presets. */
const OG_SOFT_MAX_WIDTH = Math.round(OG_IDEAL_WIDTH * 1.5);

export type OpenGraphCmsImagePick = {
	readonly src: string;
	readonly width: number;
	readonly height: number;
};

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
				src: resolveMediaAbsoluteUrl(baseUrl, url),
				width,
				height,
			});
		}
	};

	for (const name of [...FORMAT_NAMES].reverse()) {
		const v = image.formats[name];
		if (v) {
			push(v.url, v.width, v.height);
		}
	}
	push(image.url, image.width, image.height);

	const meetsMinimum = (c: OpenGraphCmsImagePick) =>
		c.width >= OG_MIN_WIDTH && c.height >= OG_MIN_HEIGHT;
	let pool = candidates.filter(meetsMinimum);
	if (pool.length === 0) {
		pool = candidates;
	}

	const scoreWidth = (c: OpenGraphCmsImagePick): number => {
		if (c.width > OG_SOFT_MAX_WIDTH) {
			return c.width;
		}
		return Math.abs(c.width - OG_IDEAL_WIDTH);
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
		src: cmsImageDefaultSrc(image, baseUrl),
		width: image.width,
		height: image.height,
	};
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
