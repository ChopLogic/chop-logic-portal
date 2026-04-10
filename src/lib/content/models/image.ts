/** Strapi upload format preset keys we care about for responsive images. */
export type CmsImageFormatName = "thumbnail" | "small" | "medium" | "large";

export interface CmsImageFormatVariant {
	readonly url: string;
	readonly width: number;
	readonly height: number;
	readonly mime?: string;
}

export type CmsImageFormats = Partial<
	Record<CmsImageFormatName, CmsImageFormatVariant>
>;

/**
 * CMS image with relative `url` as returned by Strapi. Resolve to absolute URLs
 * with helpers in `content/mappers/image` (for `astro:assets` / `<img>`).
 */
export interface CmsImage {
	readonly documentId: string;
	readonly name: string;
	readonly url: string;
	readonly width: number;
	readonly height: number;
	readonly alternativeText?: string;
	readonly caption?: string;
	readonly formats: CmsImageFormats;
}

export const IMAGE_FORMAT_NAMES: readonly CmsImageFormatName[] = [
	"thumbnail",
	"small",
	"medium",
	"large",
];

export type OpenGraphCmsImagePick = {
	readonly src: string;
	readonly width: number;
	readonly height: number;
};
