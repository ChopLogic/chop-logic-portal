import type { JsonValue } from "./json";

export interface MetaData {
	metaTitle: string;
	metaDescription: string;
	canonicalURL?: string;
	keywords?: string;
	authorName?: string;
	/** e.g. `index, follow` or `noindex, nofollow` */
	robots?: string;
	structuredData?: JsonValue;
	openGraph?: OpenGraph;
}

/** Absolute `src` for OG/Twitter tags (Astro-friendly, no Strapi-relative paths). */
export interface OpenGraphImageMeta {
	readonly src: string;
	readonly width?: number;
	readonly height?: number;
	readonly alt?: string;
}

export interface OpenGraph {
	ogDescription: string;
	ogTitle: string;
	ogType: OgType;
	ogImage?: OpenGraphImageMeta;
}

/** After `mapMetaData` / `finalizePageMetaData`: robots, OG image (+ alt), trimmed fields. */
export type PageMetaData = Omit<MetaData, "robots" | "openGraph"> & {
	robots: string;
	openGraph: OpenGraph & { ogImage: OpenGraphImageMeta & { alt: string } };
};

export enum OgType {
	ARTICLE = "article",
	WEBSITE = "website",
}
