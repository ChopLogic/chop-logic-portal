import {
	type CmsImage,
	type CmsImageFormatName,
	IMAGE_FORMAT_NAMES,
} from "../../lib/content/models/image";

export interface CmsPictureWidthVariant {
	readonly url: string;
	readonly width: number;
	readonly height: number;
}

export interface CmsPictureAttributes {
	readonly src: string;
	readonly srcset: string | undefined;
	readonly sizes: string;
	readonly width: number;
	readonly height: number;
}

const DEFAULT_SIZES = "100vw";

/** `sizes` hints for responsive CMS images in common layout contexts. */
export const CMS_PICTURE_SIZES = {
	fullWidth: DEFAULT_SIZES,
	galleryGrid:
		"(max-width: 640px) 100vw, (max-width: 1024px) 50vw, min(33vw, 360px)",
	galleryMasonry:
		"(max-width: 640px) 100vw, (max-width: 1024px) 50vw, min(33vw, 360px)",
	galleryCarousel: "min(85vw, 420px)",
} as const;

/** Collects Strapi format presets plus the original, sorted by width ascending. */
export function collectCmsPictureVariants(
	image: CmsImage,
): readonly CmsPictureWidthVariant[] {
	const byWidth = new Map<number, CmsPictureWidthVariant>();

	const add = (url: string, width: number, height: number) => {
		if (!url || width <= 0 || height <= 0) {
			return;
		}
		byWidth.set(width, { url, width, height });
	};

	for (const name of IMAGE_FORMAT_NAMES) {
		const variant = image.formats[name as CmsImageFormatName];
		if (variant) {
			add(variant.url, variant.width, variant.height);
		}
	}

	add(image.url, image.width, image.height);

	return [...byWidth.values()].sort((a, b) => a.width - b.width);
}

export function buildCmsPictureSrcset(
	variants: readonly CmsPictureWidthVariant[],
): string | undefined {
	if (variants.length <= 1) {
		return undefined;
	}
	return variants.map((v) => `${v.url} ${v.width}w`).join(", ");
}

function pickDefaultVariant(
	image: CmsImage,
	variants: readonly CmsPictureWidthVariant[],
): CmsPictureWidthVariant {
	if (variants.length === 0) {
		return { url: image.url, width: image.width, height: image.height };
	}

	const preferOrder: readonly CmsImageFormatName[] = [
		"large",
		"medium",
		"small",
		"thumbnail",
	];

	for (const name of preferOrder) {
		const format = image.formats[name];
		if (format) {
			return {
				url: format.url,
				width: format.width,
				height: format.height,
			};
		}
	}

	return variants.at(-1)!;
}

/**
 * Builds responsive attributes for a CMS image using Strapi `formats` presets.
 * Astro's `<Image>` optimizes a single URL at build time and does not map cleanly
 * onto pre-generated Strapi variants, so callers should use a native `<picture>`.
 */
export function buildCmsPictureAttributes(
	image: CmsImage,
	options?: { sizes?: string },
): CmsPictureAttributes {
	const variants = collectCmsPictureVariants(image);
	const defaultVariant = pickDefaultVariant(image, variants);
	const srcset = buildCmsPictureSrcset(variants);

	return {
		src: defaultVariant.url,
		srcset,
		sizes: options?.sizes ?? DEFAULT_SIZES,
		width: defaultVariant.width,
		height: defaultVariant.height,
	};
}
